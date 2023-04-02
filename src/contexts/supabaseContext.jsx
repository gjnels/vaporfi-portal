import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import supabase, { fetchNewValue, fetchTable } from '../lib/supabaseClient'

const SupabaseContext = createContext()

export const useSupabaseContext = () => useContext(SupabaseContext)

export const SupabaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)

  const [promos, setPromos] = useState([])
  const [flavors, setFlavors] = useState([])
  const [flavorCategories, setFlavorCategories] = useState([])
  const [nicotinePackets, setNicotinePackets] = useState([])

  useEffect(() => {
    fetchTable('promos', '*, priority(level), mix(*)', setPromos)
    fetchTable('flavors', '*, category(name)', setFlavors)
    fetchTable('flavor_categories', '*', setFlavorCategories)
    fetchTable('nicotine_packets', '*', setNicotinePackets)

    if (import.meta.env.DEV) console.log('✅ subscribing to supabase tables')

    createListener('promos', setPromos, 'priority(level), mix(*)')
    createListener('flavors', setFlavors, 'category(name)')
    createListener('flavor_categories', setFlavorCategories)
    createListener('nicotine_packets', setNicotinePackets)

    setLoading(false)

    return async () => {
      if (import.meta.env.DEV) console.log('⛔️ unsubscribing from all tables')
      await supabase.removeAllSubscriptions()
    }
  }, [])

  const createListener = useCallback((table, setState, foreignKeys) =>
    supabase
      .from(table)
      .on('INSERT', async (payload) => {
        setLoading(true)
        const newValue = foreignKeys
          ? await fetchNewValue(payload.new, table, foreignKeys)
          : payload.new
        setState((prev) => [...prev, newValue])
        setLoading(false)
      })
      .on('UPDATE', async (payload) => {
        setLoading(true)
        const newValue = foreignKeys
          ? await fetchNewValue(payload.new, table, foreignKeys)
          : payload.new
        setState((prev) =>
          prev.map((value) => (value.id === newValue.id ? newValue : value))
        )
        setLoading(false)
      })
      .on('DELETE', (payload) => {
        setState((prev) => prev.filter((value) => value.id !== payload.old.id))
      })
      .subscribe()
  )

  const insertRow = async (table, value) => {
    try {
      const { error } = await supabase.from(table).insert(value)
      throw error
    } catch (error) {
      return error
    }
  }

  const updateRow = async (table, value) => {
    try {
      const { error } = await supabase
        .from(table)
        .update(value)
        .eq('id', value.id)
      throw error
    } catch (error) {
      return error
    }
  }

  const deleteRow = async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      throw error
    } catch (error) {
      return error
    }
  }

  const value = {
    loading,
    promos,
    flavors,
    flavorCategories,
    nicotinePackets,
    insertRow,
    updateRow,
    deleteRow,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
