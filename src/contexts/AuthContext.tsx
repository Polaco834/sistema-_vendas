import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  userData: any;
  companyData: any;
  accessTypeData: any;
  loading: boolean;
  empresa_id: number | null;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  companyData: null,
  accessTypeData: null,
  loading: true, 
  empresa_id: null 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [accessTypeData, setAccessTypeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchAccessTypeData = async (tipoAcesso: number) => {
    try {
      const { data, error } = await supabase
        .from('tipo_de_acesso')
        .select('*')
        .eq('id', tipoAcesso)
        .single();

      if (error) throw error;
      setAccessTypeData(data);
    } catch (error) {
      console.error('Error fetching access type data:', error);
      setAccessTypeData(null);
    }
  };

  const fetchCompanyData = async (empresaId: number) => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (error) throw error;
      setCompanyData(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
      setCompanyData(null);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
      
      // Fetch company data if empresa_id exists
      if (data?.empresa_id) {
        await fetchCompanyData(data.empresa_id);
      }

      // Fetch access type data if tipo_acesso exists
      if (data?.tipo_acesso) {
        await fetchAccessTypeData(data.tipo_acesso);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
      setCompanyData(null);
      setAccessTypeData(null);
    }
  };

  // Initial session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkSession();
  }, []);

  // Auth state change listener
  useEffect(() => {
    if (!initialized) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUserData(null);
          setCompanyData(null);
          setAccessTypeData(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const value = {
    user,
    userData,
    companyData,
    accessTypeData,
    loading,
    empresa_id: userData?.empresa_id ?? null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
