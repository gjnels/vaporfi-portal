export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
        Relationships: [
          {
            foreignKeyName: 'approved_by'
            columns: ['approved_by_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'created_by'
            columns: ['created_by_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flavor1'
            columns: ['flavor1_id']
            isOneToOne: false
            referencedRelation: 'flavors'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flavor2'
            columns: ['flavor2_id']
            isOneToOne: false
            referencedRelation: 'flavors'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'flavor3'
            columns: ['flavor3_id']
            isOneToOne: false
            referencedRelation: 'flavors'
            referencedColumns: ['id']
          }
        ]
      }
      flavors: {
        Row: {
          category: Database['public']['Enums']['flavorcategory']
          flavor: string
          flavor_ban_name: string | null
          id: number
        }
        Insert: {
          category: Database['public']['Enums']['flavorcategory']
          flavor: string
          flavor_ban_name?: string | null
          id?: number
        }
        Update: {
          category?: Database['public']['Enums']['flavorcategory']
          flavor?: string
          flavor_ban_name?: string | null
          id?: number
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'incorrect_skus_submitted_by_profile_id_fkey'
            columns: ['submitted_by_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'incorrect_skus_submitted_from_location_id_fkey'
            columns: ['submitted_from_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'locations_tasks_completed_by_profile_id_fkey'
            columns: ['completed_by_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'locations_tasks_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'locations_tasks_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'missing_skus_submitted_by_profile_id_fkey'
            columns: ['submitted_by_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'missing_skus_submitted_from_location_id_fkey'
            columns: ['submitted_from_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string
          role: Database['public']['Enums']['role'] | null
        }
        Insert: {
          email: string
          id: string
          name?: string
          role?: Database['public']['Enums']['role'] | null
        }
        Update: {
          email?: string
          id?: string
          name?: string
          role?: Database['public']['Enums']['role'] | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'profiles_locations_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profiles_locations_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'profiles_tasks_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profiles_tasks_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'promos_custom_blend_id_fkey'
            columns: ['custom_blend_id']
            isOneToOne: false
            referencedRelation: 'custom_blends'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: []
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
      flavorcategory: 'Fruit' | 'Candy' | 'Dessert' | 'Tobacco' | 'Menthol' | 'Drinks' | 'Other'
      role: 'Store' | 'Manager' | 'Admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never
