import React from 'react';
import {DataGrid, GridColDef, frFR, enUS} from '@mui/x-data-grid';
import {Link} from '@mui/material';
import {Ranking} from "./Types";
import {useTranslation} from "react-i18next";
import {getLocaleOrFallback, SAVED_LOCALE} from "../locale";


export const RankList: React.FC<{ data: Ranking[] }> = ({data}) => {
    const {t} = useTranslation();
    const savedLocale = localStorage.getItem(SAVED_LOCALE) as string;
    const locale = getLocaleOrFallback(savedLocale);

    const columns: GridColDef[] = [
        {field: 'rank', headerName: t('ranklist.rank'), width: 90},
        {
            field: 'name',
            headerName: t('ranklist.name'),
            width: 300,
            renderCell: (params) => (
                <Link href={params.row.url} target="_blank" rel="noopener noreferrer">
                    {params.value}
                </Link>
            ),
        },
        {field: 'time', headerName: t('ranklist.time'), width: 120},
    ];

    const rows = data.map((person: any) => ({
        id: person.rank,
        rank: person.rank,
        name: person.name,
        time: person.time,
        url: person.url,
    }));

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid rows={rows} columns={columns}
                      localeText={locale === "fr" ?
                          frFR.components.MuiDataGrid.defaultProps.localeText
                          : enUS.components.MuiDataGrid.defaultProps.localeText
                      }/>
        </div>
    );
};

