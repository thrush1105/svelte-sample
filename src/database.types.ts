export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      login_attempts: {
        Row: {
          created_at: string;
          failed_attempts: number;
          id: number;
          last_failed_at: string | null;
          locked_until: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          failed_attempts?: number;
          id?: number;
          last_failed_at?: string | null;
          locked_until?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          failed_attempts?: number;
          id?: number;
          last_failed_at?: string | null;
          locked_until?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'login_attempts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      transactions: {
        Row: {
          amount: number | null;
          category: string | null;
          created_at: string;
          date: string;
          description: string | null;
          id: number;
          is_transfer: boolean;
          service: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount?: number | null;
          category?: string | null;
          created_at?: string;
          date: string;
          description?: string | null;
          id?: number;
          is_transfer: boolean;
          service: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          amount?: number | null;
          category?: string | null;
          created_at?: string;
          date?: string;
          description?: string | null;
          id?: number;
          is_transfer?: boolean;
          service?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      youtube_videos: {
        Row: {
          channel_id: string;
          channel_title: string;
          created_at: string;
          description: string | null;
          id: number;
          published_at: string | null;
          tags: Json | null;
          thumbnail: string | null;
          title: string;
          updated_at: string;
          user_id: string | null;
          video_id: string;
          view_count: number | null;
        };
        Insert: {
          channel_id: string;
          channel_title: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          published_at?: string | null;
          tags?: Json | null;
          thumbnail?: string | null;
          title: string;
          updated_at?: string;
          user_id?: string | null;
          video_id: string;
          view_count?: number | null;
        };
        Update: {
          channel_id?: string;
          channel_title?: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          published_at?: string | null;
          tags?: Json | null;
          thumbnail?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string | null;
          video_id?: string;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'youtube_videos_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      payslips: {
        Row: {
          area_allowance: number | null;
          basic_salary: number | null;
          commutation_allowance: number | null;
          created_at: string;
          employees_pension: number | null;
          employment_insurance: number | null;
          flat_amount_cut: number | null;
          health_insurance: number | null;
          id: number;
          incentive: number | null;
          income_tax: number | null;
          long_term_care_insurance: number | null;
          net_pay: number | null;
          overtime_allowance: number | null;
          payment_date: string;
          resident_tax: number | null;
          total_deductions: number | null;
          total_earnings: number | null;
          type: string | null;
          user_id: string;
          year_end_adjustment: number | null;
        };
        Insert: {
          area_allowance?: number | null;
          basic_salary?: number | null;
          commutation_allowance?: number | null;
          created_at?: string;
          employees_pension?: number | null;
          employment_insurance?: number | null;
          flat_amount_cut?: number | null;
          health_insurance?: number | null;
          id?: number;
          incentive?: number | null;
          income_tax?: number | null;
          long_term_care_insurance?: number | null;
          net_pay?: number | null;
          overtime_allowance?: number | null;
          payment_date: string;
          resident_tax?: number | null;
          total_deductions?: number | null;
          total_earnings?: number | null;
          type?: string | null;
          user_id: string;
          year_end_adjustment?: number | null;
        };
        Update: {
          area_allowance?: number | null;
          basic_salary?: number | null;
          commutation_allowance?: number | null;
          created_at?: string;
          employees_pension?: number | null;
          employment_insurance?: number | null;
          flat_amount_cut?: number | null;
          health_insurance?: number | null;
          id?: number;
          incentive?: number | null;
          income_tax?: number | null;
          long_term_care_insurance?: number | null;
          net_pay?: number | null;
          overtime_allowance?: number | null;
          payment_date?: string;
          resident_tax?: number | null;
          total_deductions?: number | null;
          total_earnings?: number | null;
          type?: string | null;
          user_id?: string;
          year_end_adjustment?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payslips_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_yearly_payslip: {
        Args: Record<PropertyKey, never>;
        Returns: {
          year: number;
          basic_salary: number;
          overtime_allowance: number;
          total_earnings: number;
          health_insurance: number;
          employees_pension: number;
          employment_insurance: number;
          income_tax: number;
          resident_tax: number;
          total_deductions: number;
          net_pay: number;
        }[];
      };
      get_transaction_categories: {
        Args: Record<PropertyKey, never>;
        Returns: {
          value: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {}
  }
} as const;
