import { useCallback, useEffect, useState } from 'react';
import * as specialtiesService from '../services/specialtiesService';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const useSpecialties = ({
  pageSize = 5,
  specialtiesApi = specialtiesService,
} = {}) => {
  const [specialties, setSpecialties] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchSpecialties = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await specialtiesApi.getSpecialties({
        pageSize,
        pageIndex,
        name: appliedSearch,
      });

      setSpecialties(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Error al cargar las especialidades')
      );
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, appliedSearch, pageSize, specialtiesApi]);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  const search = (text) => {
    setPageIndex(1);
    setAppliedSearch(text);
  };

  const saveSpecialty = async (formData, editingId = null) => {
    try {
      if (editingId) {
        await specialtiesApi.updateSpecialty(editingId, formData);
      } else {
        await specialtiesApi.createSpecialty(formData);
      }

      await fetchSpecialties();

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error, 'Error al guardar la especialidad'),
      };
    }
  };

  const removeSpecialty = async (id) => {
    try {
      await specialtiesApi.deleteSpecialty(id);
      await fetchSpecialties();

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error, 'Error al eliminar la especialidad'),
      };
    }
  };

  return {
    specialties,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
    pageIndex,
    pageSize,
    isLoading,
    errorMessage,
    setPageIndex,
    search,
    saveSpecialty,
    removeSpecialty,
  };
};

export default useSpecialties;