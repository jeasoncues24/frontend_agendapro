import { getSpeciality, getSpecialityCollaborator } from "@/services/speciality.service";
import { useState, useEffect } from "react";

export const useSpeciality = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number
) => {
    const [speciality, setSpeciality] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getSpeciality(establishmentId)
            .then(res => setSpeciality(res.data))
            .catch(( err ) => setError(err.message || "Error al cargar las especialidades"))
            .finally(() => setIsLoading(false));

    }, [companyId, establishmentId, refreshKey]);

    return { speciality, isLoading, error };
};

export const useSpecialityActives = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number
) => {
    const [speciality, setSpeciality] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getSpeciality(establishmentId)
            .then(res => setSpeciality(res.data))
            .catch(( err ) => setError(err.message || "Error al cargar las especialidades"))
            .finally(() => setIsLoading(false));

    }, [companyId, establishmentId, refreshKey]);

    return { speciality, isLoading, error };
};

export const useSpecialityCollaborators = (
    collaboratorId?: string,
    refreshKey?: number
) => {
    const [specialityCollaborator, setSpecialityCollaborator] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !collaboratorId ) return;
        setIsLoading(true);
        getSpecialityCollaborator(collaboratorId)
            .then(res => setSpecialityCollaborator(res.data))
            .catch(( err ) => setError(err.message || "Error al cargar las especialidades del colaborador"))
            .finally(() => setIsLoading(false));

    }, [collaboratorId, refreshKey]);

    return { specialityCollaborator, isLoading, error };
};

