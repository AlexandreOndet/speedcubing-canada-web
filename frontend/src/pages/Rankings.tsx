import {useTranslation} from "react-i18next";
import {
    Box,
    Container, Typography,
} from "@mui/material";
import * as React from 'react';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import CircularProgress from "@mui/material/CircularProgress";
import {eventID, Province, provinceID, useAverage} from "../components/Types";
import {GetProvinces} from "../components/Provinces";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../components/Api";
import httpClient from "../httpClient";


export const Rankings = () => {
    const {t} = useTranslation();

    const provinces: Province[] = GetProvinces();
    const [province, setProvince] = useState<Province | null>(provinces[0]);
    const [eventId, setEventId] = useState<eventID>("333");
    const [useAverage, setUseAverage] = useState(false);
    const [loading, setLoading] = useState(true);

    const switchHandler = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setUseAverage(event.target.checked);
        console.log(ranking);
    };

    const handleProvinceChange = (event: any, newValue: React.SetStateAction<Province | null>) => {
        setProvince(newValue);

        if (province == null) {
            // Handle the case when the province value is null.
        } else {
            // Do something with the ranking data (it will be updated automatically when the hook fetches new data).
            console.log(ranking);
            if (province.id === "qc") {
                console.log("Vive le Québec libre!");
            }
        }
    };


    const [ranking, setRanking] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        let use_average_str = "0";
        if (useAverage) {
            use_average_str = "1";
        }

        (async () => {
            try {
                if (eventId === null || province?.id === null || useAverage === null) {
                    return null;
                }

                //const resp = await httpClient.get(API_BASE_URL + "/province_rankings/" + eventId + "/" + provinceId + "/" + use_average_str);
                const resp = await httpClient.get(API_BASE_URL + "/test_rankings");

                setRanking(resp.data);
            } catch (error: any) {
                if (error.response.status === 500) {
                    console.log("Internal server error" + error.response.data);
                } else if (error.response.status === 404) {
                    console.log("Not found" + error.response.data);
                }
            }
            setLoading(false);
        })();
    }, []);


    return (
        <Container maxWidth="md">

            <Box marginY="4rem">
                <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom>
                    {t("rankings.title")}
                </Typography>
            </Box>

            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={provinces}
                sx={{width: 300}}
                value={province}
                onChange={handleProvinceChange}
                renderInput={(params) => <TextField {...params} label="Province"/>}
                getOptionLabel={(option) => t('provinces.'+option.id)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{t("rankings.single")}</Typography>
                <Switch checked={useAverage}
                        onChange={switchHandler}
                        color="primary"/>
                <Typography>{t("rankings.average")}</Typography>
            </Stack>
            {loading ? <CircularProgress/>
                : ranking != null ? (
                    <div>{t('rankings.rankfor')} {t("province_with_pronouns." + province?.id)}</div>
                ) : (
                    <div>Nothing to show</div>
                )}
        </Container>
    );
};