import { useState, useEffect, useCallback } from 'react';
import useAuth from '../../auth/hook/useAuth';
import { getAppointments } from '../services/GetAppointmentsService';
import { deleteAppointment } from '../services/DeleteAppointmentsService';

export function usePatientAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppointments = useCallback(async () => {
        if (!user?.dni) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await getAppointments(user.dni);
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar turnos:', err);
            setError(
                err?.response?.data?.message || 'Error al obtener tus turnos médicos.'
            );
        } finally {
            setLoading(false);
        }
    }, [user?.dni]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const cancelAppointment = async (id) => {
        try {
            await deleteAppointment(id);
            await fetchAppointments();
            return { success: true };
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message || 'No se pudo cancelar el turno.';
            return { success: false, error: errorMsg };
        }
    };

    return {
        appointments,
        loading,
        error,
        cancelAppointment,
        refresh: fetchAppointments,
    };
}