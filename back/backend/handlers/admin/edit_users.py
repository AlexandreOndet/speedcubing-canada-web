from json import loads

from flask import abort, Blueprint, render_template, jsonify, request
from google.cloud import ndb

from backend.lib import auth
from backend.lib.common import Common
from backend.models.user import Roles, User
from backend.models.wca.person import Person

bp = Blueprint('edit_users', __name__)
client = ndb.Client()


# @bp.route('/edit_users')
def edit_users():
    with client.context():
        me = auth.user()
        if not me or not me.HasAnyRole(Roles.AdminRoles()):
            abort(403)
        return render_template('admin/edit_users.html',
                               c=Common())


@bp.route('/get_users')
def get_users():
    with client.context():
        me = auth.user()
        if not me or not me.HasAnyRole(Roles.AdminRoles()):
            return jsonify({"error": "Forbidden"}), 403

        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        cursor = request.args.get('cursor', None, type=str)
        if cursor:
            cursor = ndb.Cursor(urlsafe=cursor)
            print(cursor)
        if page < 1:
            page = 1
        if per_page not in [10, 20, 30, 40, 50]:
            per_page = 30

        # Sort
        sort_field = request.args.get('sort_field', 'name')
        sort_order = request.args.get('sort_order', 'asc')
        if sort_field not in ['name', 'wca_person', 'roles', 'province']:
            sort_field = 'name'
        if sort_order not in ['asc', 'desc']:
            sort_order = 'asc'

        # Filter
        filter_text = loads(request.args.get('filter', '')).get("q")
        print(filter_text)

        # Query
        if sort_order == 'asc':
            order_field = getattr(User, sort_field)
        else:
            order_field = -getattr(User, sort_field)
        if filter_text:
            text = filter_text.lower()
            limit = text[:-1] + chr(ord(text[-1]) + 1)
            users_to_show = User.query(
                ndb.OR(
                    ndb.AND(
                        User.name_lower >= text,
                        User.name_lower < limit,
                    ),
                    User.wca_person == ndb.Key(Person, filter_text)
                )).order("name_lower", order_field).fetch(per_page)
            has_more = False
        else:
            users_to_show, cursor, has_more = User.query(order_by=[order_field]).fetch_page(per_page,
                                                                                            start_cursor=cursor)

        print(users_to_show)
        # Calculate the total count of results
        total_results = len(users_to_show)

        # Set the Content-Range header
        headers = {
            'Content-Range': f'items 0-{total_results - 1}/{total_results}'
        }
        return jsonify({
            'data': [user.toJson() for user in users_to_show],
            'cursor': cursor.urlsafe().decode() if cursor else '',
            'pageInfo': {
                'hasPreviousPage': page > 1,
                'hasNextPage': has_more,
            }
        })


@bp.route('/get_users_by_id')
def get_users_by_id():
    with client.context():
        me = auth.user()
        if not me or not me.HasAnyRole(Roles.AdminRoles()):
            return jsonify({"error": "Forbidden"}), 403

        user_ids = request.args.get('ids', "[]", type=str).strip("[]").split(",")
        for user_id in user_ids:
            if not user_id.isdigit():
                return jsonify({"error": "Invalid user id: " + user_id}), 400
            else:
                user_id = int(user_id)
        users = User.query(User.key.IN([ndb.Key(User, user_id) for user_id in user_ids])).fetch()
        data = [user.toJson() for user in users]
        return jsonify(
            {'data': data}
        )
