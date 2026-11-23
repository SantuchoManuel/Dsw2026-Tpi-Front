import { useState, useEffect } from 'react';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctors } from '../../doctors/services/doctorsService';
import { searchAppointments } from '../services/appointmentsService';
import { buildSearchChips, buildAlertDetail } from '../helpers/appointmentHelpers';

const PAGE_SIZE = 10;

function useAppointmentSearch() {

  const [dniQuery, setDniQuery] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChips, setActiveChips] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specData, docData] = await Promise.all([
          getSpecialties({ pageSize: 100, pageIndex: 1 }),
          getDoctors({ pageSize: 100, pageIndex: 1 }),
        ]);
        setSpecialties(specData.data || []);
        setDoctors(docData.data || []);
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    };
    fetchFilters();
  }, []);

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const params = { pageSize: PAGE_SIZE, pageIndex: page };
      if (dniQuery.trim()) params.dni = Number(dniQuery.trim());
      if (specialtyId) params.specialtyId = specialtyId;
      if (doctorId) params.doctorId = doctorId;
      if (dateFilter) params.date = dateFilter;

      const data = await searchAppointments(params);

      setAppointments(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE) || 1);
      setPageIndex(page);
      setHasSearched(true);

      setActiveChips(
        buildSearchChips({ dniQuery, specialtyId, doctorId, dateFilter }, specialties, doctors)
      );
    } catch (err) {
      console.error('Error buscando citas:', err);
      setErrorMsg(
        err?.response?.data?.message || 'Error al buscar. Verificá los filtros.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => fetchAppointments(1);
  const handlePageChange = (p) => fetchAppointments(p);
  const handleVerDetalle = (item) => window.alert(buildAlertDetail(item));

  return {

    dniQuery, setDniQuery,
    specialtyId, setSpecialtyId,
    doctorId, setDoctorId,
    dateFilter, setDateFilter,
    specialties,
    doctors,
    appointments,
    totalItems,
    pageIndex,
    totalPages,
    pageSize: PAGE_SIZE,
    loading,
    hasSearched,
    activeChips,
    errorMsg,
    handleApplyFilters,
    handlePageChange,
    handleVerDetalle,
  };
}

export default useAppointmentSearch;
