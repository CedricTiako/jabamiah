export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string;
          created_at: string;
          created_by: string | null;
          duration_minutes: number;
          id: string;
          location: string | null;
          note: string | null;
          session_type: string | null;
          starts_at: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number;
          id?: string;
          location?: string | null;
          note?: string | null;
          session_type?: string | null;
          starts_at: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number;
          id?: string;
          location?: string | null;
          note?: string | null;
          session_type?: string | null;
          starts_at?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          birth_date: string | null;
          city: string | null;
          created_at: string;
          created_by: string | null;
          email: string | null;
          full_name: string;
          id: string;
          phone: string | null;
          private_notes: string | null;
          reason: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          birth_date?: string | null;
          city?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          full_name: string;
          id?: string;
          phone?: string | null;
          private_notes?: string | null;
          reason?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          birth_date?: string | null;
          city?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          full_name?: string;
          id?: string;
          phone?: string | null;
          private_notes?: string | null;
          reason?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consultations: {
        Row: {
          advice: string | null;
          appointment_id: string | null;
          client_id: string;
          consultation_date: string;
          created_at: string;
          created_by: string | null;
          duration_minutes: number;
          id: string;
          mood: number | null;
          objectives: string | null;
          report: string;
          techniques: string | null;
          updated_at: string;
        };
        Insert: {
          advice?: string | null;
          appointment_id?: string | null;
          client_id: string;
          consultation_date: string;
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number;
          id?: string;
          mood?: number | null;
          objectives?: string | null;
          report: string;
          techniques?: string | null;
          updated_at?: string;
        };
        Update: {
          advice?: string | null;
          appointment_id?: string | null;
          client_id?: string;
          consultation_date?: string;
          created_at?: string;
          created_by?: string | null;
          duration_minutes?: number;
          id?: string;
          mood?: number | null;
          objectives?: string | null;
          report?: string;
          techniques?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultations_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "consultations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_address: string | null;
          locale: string | null;
          message: string;
          name: string;
          read_at: string | null;
          replied_at: string | null;
          reply_message: string | null;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_address?: string | null;
          locale?: string | null;
          message: string;
          name: string;
          read_at?: string | null;
          replied_at?: string | null;
          reply_message?: string | null;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_address?: string | null;
          locale?: string | null;
          message?: string;
          name?: string;
          read_at?: string | null;
          replied_at?: string | null;
          reply_message?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          client_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          doc_type: string | null;
          file_size: number | null;
          id: string;
          mime_type: string | null;
          storage_path: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          doc_type?: string | null;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          storage_path: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          doc_type?: string | null;
          file_size?: number | null;
          id?: string;
          mime_type?: string | null;
          storage_path?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      energy_assessments: {
        Row: {
          assessment_date: string;
          axis_concentration: number;
          axis_confiance: number;
          axis_douleurs: number;
          axis_emotions: number;
          axis_energie: number;
          axis_fatigue: number;
          axis_motivation: number;
          axis_stress: number;
          client_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          observations: string | null;
          updated_at: string;
        };
        Insert: {
          assessment_date?: string;
          axis_concentration?: number;
          axis_confiance?: number;
          axis_douleurs?: number;
          axis_emotions?: number;
          axis_energie?: number;
          axis_fatigue?: number;
          axis_motivation?: number;
          axis_stress?: number;
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          observations?: string | null;
          updated_at?: string;
        };
        Update: {
          assessment_date?: string;
          axis_concentration?: number;
          axis_confiance?: number;
          axis_douleurs?: number;
          axis_emotions?: number;
          axis_energie?: number;
          axis_fatigue?: number;
          axis_motivation?: number;
          axis_stress?: number;
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          observations?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "energy_assessments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      faqs: {
        Row: {
          answer: string;
          created_at: string;
          created_by: string | null;
          id: string;
          published: boolean;
          question: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          published?: boolean;
          question: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          published?: boolean;
          question?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          client_id: string | null;
          created_at: string;
          created_by: string | null;
          donor_name: string | null;
          id: string;
          method: string | null;
          note: string | null;
          payment_date: string;
          reference: string | null;
          source: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          donor_name?: string | null;
          id?: string;
          method?: string | null;
          note?: string | null;
          payment_date?: string;
          reference?: string | null;
          source?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          donor_name?: string | null;
          id?: string;
          method?: string | null;
          note?: string | null;
          payment_date?: string;
          reference?: string | null;
          source?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      post_translations: {
        Row: {
          body: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          locale: string;
          meta_description: string | null;
          post_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          locale: string;
          meta_description?: string | null;
          post_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          locale?: string;
          meta_description?: string | null;
          post_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_translations_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string | null;
          cover_image_url: string | null;
          created_at: string;
          id: string;
          published_at: string | null;
          slug: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          full_name: string | null;
          notification_prefs: Json;
          phone: string | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          notification_prefs?: Json;
          phone?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          notification_prefs?: Json;
          phone?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      protocols: {
        Row: {
          category: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          duration_minutes: number | null;
          id: string;
          name: string;
          steps: string | null;
          updated_at: string;
          warnings: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          duration_minutes?: number | null;
          id?: string;
          name: string;
          steps?: string | null;
          updated_at?: string;
          warnings?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          duration_minutes?: number | null;
          id?: string;
          name?: string;
          steps?: string | null;
          updated_at?: string;
          warnings?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_email: string | null;
          author_name: string;
          body: string;
          created_at: string;
          id: string;
          moderated_at: string | null;
          moderated_by: string | null;
          rating: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          author_email?: string | null;
          author_name: string;
          body: string;
          created_at?: string;
          id?: string;
          moderated_at?: string | null;
          moderated_by?: string | null;
          rating: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          author_email?: string | null;
          author_name?: string;
          body?: string;
          created_at?: string;
          id?: string;
          moderated_at?: string | null;
          moderated_by?: string | null;
          rating?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
