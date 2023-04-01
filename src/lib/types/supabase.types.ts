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
          flavor1_id: number | null
          flavor2_id: number | null
          flavor3_id: number | null
          id: number
          name: string
          shots1: number | null
          shots2: number | null
          shots3: number | null
        }
        Insert: {
          approved?: boolean
          approved_by_profile_id?: string | null
          created_by_profile_id?: string | null
          flavor1_id?: number | null
          flavor2_id?: number | null
          flavor3_id?: number | null
          id?: number
          name: string
          shots1?: number | null
          shots2?: number | null
          shots3?: number | null
        }
        Update: {
          approved?: boolean
          approved_by_profile_id?: string | null
          created_by_profile_id?: string | null
          flavor1_id?: number | null
          flavor2_id?: number | null
          flavor3_id?: number | null
          id?: number
          name?: string
          shots1?: number | null
          shots2?: number | null
          shots3?: number | null
        }
      }
      flavors: {
        Row: {
          category: Database["public"]["Enums"]["flavorcategory"]
          flavor: string
          id: number
        }
        Insert: {
          category: Database["public"]["Enums"]["flavorcategory"]
          flavor: string
          id?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["flavorcategory"]
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
          submitted_from_id: number
        }
        Insert: {
          correct_item_name: string
          fixed?: boolean
          id?: number
          incorrect_item_name: string
          notes?: string | null
          sku: string
          submitted_from_id: number
        }
        Update: {
          correct_item_name?: string
          fixed?: boolean
          id?: number
          incorrect_item_name?: string
          notes?: string | null
          sku?: string
          submitted_from_id?: number
        }
      }
      location_tasks: {
        Row: {
          complete: boolean
          completed_at: string | null
          id: number
          location_id: number
          task_id: number
        }
        Insert: {
          complete?: boolean
          completed_at?: string | null
          id?: number
          location_id: number
          task_id: number
        }
        Update: {
          complete?: boolean
          completed_at?: string | null
          id?: number
          location_id?: number
          task_id?: number
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
      missing_skus: {
        Row: {
          fixed: boolean
          id: number
          item_name: string
          notes: string | null
          sku: string
          submitted_from_id: number
        }
        Insert: {
          fixed?: boolean
          id?: number
          item_name: string
          notes?: string | null
          sku: string
          submitted_from_id: number
        }
        Update: {
          fixed?: boolean
          id?: number
          item_name?: string
          notes?: string | null
          sku?: string
          submitted_from_id?: number
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
          id: string
          name: string | null
          role: Database["public"]["Enums"]["role"] | null
        }
        Insert: {
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["role"] | null
        }
        Update: {
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["role"] | null
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
          due_date: string
          id: number
          notes: string | null
          task: string
        }
        Insert: {
          due_date: string
          id?: number
          notes?: string | null
          task: string
        }
        Update: {
          due_date?: string
          id?: number
          notes?: string | null
          task?: string
        }
      }
      user_locations: {
        Row: {
          id: number
          location_id: number
          user_id: string
        }
        Insert: {
          id?: number
          location_id: number
          user_id: string
        }
        Update: {
          id?: number
          location_id?: number
          user_id?: string
        }
      }
      user_tasks: {
        Row: {
          complete: boolean
          completed_at: string | null
          id: number
          task_id: number
          user_id: string
        }
        Insert: {
          complete?: boolean
          completed_at?: string | null
          id?: number
          task_id: number
          user_id: string
        }
        Update: {
          complete?: boolean
          completed_at?: string | null
          id?: number
          task_id?: number
          user_id?: string
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
          required_role: Database["public"]["Enums"]["role"]
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
        | "Fruit"
        | "Candy"
        | "Dessert"
        | "Tobacco"
        | "Menthol"
        | "Drinks"
        | "Other"
      role: "Store" | "Manager" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
