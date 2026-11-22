import { useState, useEffect } from 'react';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctors } from '../../doctors/services/doctorsService';
import { searchAppointments } from '../services/appointmentsService';
import { buildSearchChips, buildAlertDetail } from '../helpers/appointmentHelpers';

const PAGE_SIZE = 10;

/**
 * Custom hook that encapsulates all logic for the AppointmentsSearchPage:
 * - filter state (dni, specialty, doctor, date)
 * - dropdown data (specialties, doctors)
 * - search results, pagination, loading and error state
 * - handlers: applyFilters, pageChange, verDetalle
 */
function useAppointmentSearch() {
  // ── Filter fields ────────────────────────────────────────────────────────
  const [dniQuery, setDniQuery] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // ── Dropdown data ────────────────────────────────────────────────────────
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // ── Results ──────────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeChips, setActiveChips] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Load filter dropdowns once on mount ──────────────────────────────────
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

  // ── Search ───────────────────────────────────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = () => fetchAppointments(1);
  const handlePageChange = (p) => fetchAppointments(p);
  const handleVerDetalle = (item) => window.alert(buildAlertDetail(item));

  return {
    // filter state + setters
    dniQuery, setDniQuery,
    specialtyId, setSpecialtyId,
    doctorId, setDoctorId,
    dateFilter, setDateFilter,
    // dropdown data
    specialties,
    doctors,
    // results
    appointments,
    totalItems,
    pageIndex,
    totalPages,
    pageSize: PAGE_SIZE,
    // UI
    loading,
    hasSearched,
    activeChips,
    errorMsg,
    // handlers
    handleApplyFilters,
    handlePageChange,
    handleVerDetalle,
  };
}

export default useAppointmentSearch;
