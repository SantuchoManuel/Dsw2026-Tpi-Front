import { useCallback, useEffect, useState } from 'react';
import * as specialtiesService from '../../specialties/services/specialtiesService';
import * as appointmentsService from '../../appointments/services/appointmentsService';

const useDashboardStats = ({
  specialtiesApi = specialtiesService,
  appointmentsApi = appointmentsService,
} = {}) => {
  const [totalSpecialties, setTotalSpecialties] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [specialtiesData, appointmentsData] = await Promise.all([
        specialtiesApi.getSpecialties({ pageSize: 1, pageIndex: 1 }),
        appointmentsApi.getAppointmentsByDate(today),
      ]);

      setTotalSpecialties(specialtiesData?.total || 0);
      setTodayAppointments(
        Array.isArray(appointmentsData) ? appointmentsData.length : 0
      );
    } catch (err) {
      console.error('Error al cargar estadísticas del dashboard:', err);
    }
  }, [specialtiesApi, appointmentsApi]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    totalSpecialties,
    todayAppointments,
    reloadStats: fetchStats,
  };
};

export default useDashboardStats;