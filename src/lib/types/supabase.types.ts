export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      custom_blends: {
        Row: {
          approved: boolean
          approved_by_profile_id: string | null
          created_by_profile_id: string | null
          flavor1_id: number
          flavor2_id: number | null
          flavor3_id: number | null
          id: number
          name: string
          shots1: number
          shots2: number | null
          shots3: number | null
        }
        Insert: {
          approved?: boolean
          approved_by_profile_id?: string | null
          created_by_profile_id?: string | null
          flavor1_id: number
          flavor2_id?: number | null
          flavor3_id?: number | null
          id?: number
          name: string
          shots1: number
          shots2?: number | null
          shots3?: number | null
        }
        Update: {
          approved?: boolean
          approved_by_profile_id?: string | null
          created_by_profile_id?: string | null
          flavor1_id?: number
          flavor2_id?: number | null
          flavor3_id?: number | null
          id?: number
          name?: string
          shots1?: number
          shots2?: number | null
          shots3?: number | null
        }
      }
      flavors: {
        Row: {
          category: Database['public']['Enums']['flavorcategory']
          flavor: string
          id: number
        }
        Insert: {
          category: Database['public']['Enums']['flavorcategory']
          flavor: string
          id?: number
        }
        Update: {
          category?: Database['public']['Enums']['flavorcategory']
          flavor?: string
          id?: number
        }
      }
      incorrect_skus: {
        Row: {
          correct_item_name: string
          fixed: boolean
          id: number
          incorrect_item_name: string
          notes: string | null
          sku: string
          submitted_by_name: string | null
          submitted_by_profile_id: string | null
          submitted_from_location_id: number | null
        }
        Insert: {
          correct_item_name: string
          fixed?: boolean
          id?: number
          incorrect_item_name: string
          notes?: string | null
          sku: string
          submitted_by_name?: string | null
          submitted_by_profile_id?: string | null
          submitted_from_location_id?: number | null
        }
        Update: {
          correct_item_name?: string
          fixed?: boolean
          id?: number
          incorrect_item_name?: string
          notes?: string | null
          sku?: string
          submitted_by_name?: string | null
          submitted_by_profile_id?: string | null
          submitted_from_location_id?: number | null
        }
      }
      locations: {
        Row: {
          address: string
          id: number
          name: string
          phone: string
        }
        Insert: {
          address: string
          id?: number
          name: string
          phone: string
        }
        Update: {
          address?: string
          id?: number
          name?: string
          phone?: string
        }
      }
      locations_tasks: {
        Row: {
          complete: boolean
          completed_at: string | null
          completed_by_name: string | null
          completed_by_profile_id: string | null
          location_id: number
          task_id: number
        }
        Insert: {
          complete?: boolean
          completed_at?: string | null
          completed_by_name?: string | null
          completed_by_profile_id?: string | null
          location_id: number
          task_id: number
        }
        Update: {
          complete?: boolean
          completed_at?: string | null
          completed_by_name?: string | null
          completed_by_profile_id?: string | null
          location_id?: number
          task_id?: number
        }
      }
      missing_skus: {
        Row: {
          fixed: boolean
          id: number
          item_name: string
          notes: string | null
          sku: string
          submitted_by_name: string | null
          submitted_by_profile_id: string | null
          submitted_from_location_id: number | null
        }
        Insert: {
          fixed?: boolean
          id?: number
          item_name: string
          notes?: string | null
          sku: string
          submitted_by_name?: string | null
          submitted_by_profile_id?: string | null
          submitted_from_location_id?: number | null
        }
        Update: {
          fixed?: boolean
          id?: number
          item_name?: string
          notes?: string | null
          sku?: string
          submitted_by_name?: string | null
          submitted_by_profile_id?: string | null
          submitted_from_location_id?: number | null
        }
      }
      nicotine_packets: {
        Row: {
          color: string
          id: number
          mg: number
          salt: boolean
        }
        Insert: {
          color: string
          id?: number
          mg: number
          salt: boolean
        }
        Update: {
          color?: string
          id?: number
          mg?: number
          salt?: boolean
        }
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string | null
          role: Database['public']['Enums']['role'] | null
        }
        Insert: {
          email: string
          id: string
          name?: string | null
          role?: Database['public']['Enums']['role'] | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          role?: Database['public']['Enums']['role'] | null
        }
      }
      profiles_locations: {
        Row: {
          location_id: number
          profile_id: string
        }
        Insert: {
          location_id: number
          profile_id: string
        }
        Update: {
          location_id?: number
          profile_id?: string
        }
      }
      profiles_tasks: {
        Row: {
          complete: boolean
          completed_at: string | null
          profile_id: string
          task_id: number
        }
        Insert: {
          complete?: boolean
          completed_at?: string | null
          profile_id: string
          task_id: number
        }
        Update: {
          complete?: boolean
          completed_at?: string | null
          profile_id?: string
          task_id?: number
        }
      }
      promos: {
        Row: {
          custom_blend_id: number | null
          details: string | null
          id: number
          notes: string | null
          sale: string
          subtitle: string | null
          title: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          custom_blend_id?: number | null
          details?: string | null
          id?: number
          notes?: string | null
          sale: string
          subtitle?: string | null
          title: string
          valid_from: string
          valid_until: string
        }
        Update: {
          custom_blend_id?: number | null
          details?: string | null
          id?: number
          notes?: string | null
          sale?: string
          subtitle?: string | null
          title?: string
          valid_from?: string
          valid_until?: string
        }
      }
      tasks: {
        Row: {
          due_date: string | null
          id: number
          notes: string | null
          task: string
        }
        Insert: {
          due_date?: string | null
          id?: number
          notes?: string | null
          task: string
        }
        Update: {
          due_date?: string | null
          id?: number
          notes?: string | null
          task?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      authorize_location: {
        Args: {
          user_id: string
          location_id: number
        }
        Returns: boolean
      }
      authorize_manager: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      authorize_role: {
        Args: {
          user_id: string
          required_role: Database['public']['Enums']['role']
        }
        Returns: boolean
      }
      authorize_store: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      autorize_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      autorize_manager: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      autorize_store: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      flavorcategory:
        | 'Fruit'
        | 'Candy'
        | 'Dessert'
        | 'Tobacco'
        | 'Menthol'
        | 'Drinks'
        | 'Other'
      role: 'Store' | 'Manager' | 'Admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
