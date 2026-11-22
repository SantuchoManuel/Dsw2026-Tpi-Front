import { useCallback, useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorsService';

//hook para traer los doctores con paginacion y busqueda
//lo sacamos de DoctorsPage para que la pagina solo se encargue de mostrar
const useDoctors = (pageSize = 5) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedSearch, setAppliedSearch] = useState('');

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctors({
        pageSize,
        pageIndex,
        name: appliedSearch,
      });

      setDoctors(data.data || []);
      setTotalCount(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize) || 1);
    } catch (err) {
      console.error('Error al cargar doctores:', err);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, appliedSearch, pageSize]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  //cuando se busca volvemos a la primer pagina
  const buscar = (texto) => {
    setPageIndex(1);
    setAppliedSearch(texto);
  };

  return {
    doctors,
    loading,
    pageIndex,
    setPageIndex,
    totalPages,
    totalCount,
    pageSize,
    buscar,
    recargar: fetchDoctors,
  };
};

export default useDoctors;