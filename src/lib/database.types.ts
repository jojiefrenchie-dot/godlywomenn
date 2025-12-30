export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          image: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          image?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          image?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}