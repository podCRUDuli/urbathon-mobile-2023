import axios from 'axios';
import {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
} from './types/auth/types';

const AuthContext = createContext();

const BASE_API_URL = 'http://176.222.53.146:8080';

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case LOGIN_SUCCESS:
          return {
            ...prevState,
            isAuthenticated: true,
            user: action.payload,
          };
        case LOGIN_FAIL:
          return { ...prevState };
        case SIGNUP_SUCCESS:
          return { ...prevState };
        case SIGNUP_FAIL:
          return { ...prevState };
        case USER_LOADED_SUCCESS:
          return {
            ...prevState,
            isAuthenticated: true,
            user: action.payload,
            isLoading: false,
          };
        case USER_LOADED_FAIL:
          return {
            ...prevState,
            isLoading: false,
          };
        case LOGOUT:
          return {
            ...prevState,
            isAuthenticated: false,
            user: null,
          };
        default:
          return state;
      }
    },
    {
      isAuthenticated: false,
      user: null,
      isLoading: true,
    },
  );

  const api = useMemo(
    () => ({
      logout: () => {
        return new Promise(async (resolve, reject) => {
          try {
            await axios.post(`${BASE_API_URL}/api/auth/logout`);
            dispatch({ type: LOGOUT });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
      login: (email, password) => {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await axios.post(
              `${BASE_API_URL}/api/auth/login`,
              {
                email,
                password,
              },
            );
            dispatch({
              type: LOGIN_SUCCESS,
              payload: {
                id: response.data.id,
                last_name: response.data.last_name,
                first_name: response.data.first_name,
                patronymic: response.data.patronymic,
                phone: response.data.phone,
                email: response.data.email,
              },
            });
            resolve();
          } catch (error) {
            dispatch({ type: LOGIN_FAIL });
            reject(error);
          }
        });
      },
      register: (name, email, password) => {
        return new Promise(async (resolve, reject) => {
          try {
            await axios.post(`${BASE_API_URL}/api/auth/register`, {
              email,
              name,
              password,
            });
            dispatch({ type: SIGNUP_SUCCESS });
            resolve();
          } catch (error) {
            dispatch({ type: SIGNUP_FAIL });
            reject(error);
          }
        });
      },
    }),
    [],
  );

  const bootstrapAsync = async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}/api/auth/test`);
      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: {
          id: response.data.id,
          last_name: response.data.last_name,
          first_name: response.data.first_name,
          patronymic: response.data.patronymic,
          phone: response.data.phone,
          email: response.data.email,
        },
      });
    } catch {
      dispatch({ type: USER_LOADED_FAIL });
    }
  };

  useEffect(() => {
    bootstrapAsync();

    const intervalId = setInterval(
      () => {
        bootstrapAsync();
      },
      15 * 60 * 1000,
    );

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, api }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthProvider, useAuth };
