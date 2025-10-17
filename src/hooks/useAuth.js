import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserFromStorage } from '../REDUX/userSlice';

/**
 * Hook personalizado para manejar la autenticación
 * @returns {Object} - { user, isAuthenticated, loading, error }
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users?.user);
  const loading = useSelector((state) => state.users?.loading);
  const error = useSelector((state) => state.users?.error);

  const isAuthenticated = user && Object.keys(user).length > 0 && user.id;

  useEffect(() => {
    // Cargar usuario desde localStorage si no está en Redux
    if (!isAuthenticated) {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, isAuthenticated]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;