export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          email: string | null;
          owner_id: string;
          tax_identifier: string | null;
          logo_url: string | null;
          business_type:
            | 'retail'
            | 'wholesale'
            | 'services'
            | 'manufacturing'
            | 'restaurant'
            | null;
          business_address: string | null;
          gst_number: string | null;
          pan_number: string | null;
          business_phone: string | null;
          description: string | null;
          whatsapp_number: string | null;
          building_name: string | null;
          street: string | null;
          landmark: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          pincode: string | null;
          business_hours: string | null;
          display_id: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          email?: string | null;
          owner_id: string;
          tax_identifier?: string | null;
          logo_url?: string | null;
          business_type?: string | null;
          business_address?: string | null;
          gst_number?: string | null;
          pan_number?: string | null;
          business_phone?: string | null;
          description?: string | null;
          whatsapp_number?: string | null;
          building_name?: string | null;
          street?: string | null;
          landmark?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          pincode?: string | null;
          business_hours?: string | null;
          display_id?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<
          Database['public']['Tables']['organizations']['Insert']
        >;
      };
      organization_members: {
        Row: {
          organization_id: string;
          user_id: string;
          role: string;
          display_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          department: string | null;
          is_active: boolean;
          last_activity: string | null;
          joining_date: string | null;
          allowed_routes: Json;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          organization_id: string;
          user_id: string;
          role?: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          department?: string | null;
          is_active?: boolean;
          last_activity?: string | null;
          joining_date?: string | null;
          allowed_routes?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<
          Database['public']['Tables']['organization_members']['Insert']
        >;
      };
      organization_settings: {
        Row: {
          organization_id: string;
          currency: string;
          timezone: string;
          store_name: string | null;
          store_enabled: boolean;
          store_domain: string | null;
          pos_config: Json;
          notification_config: Json;
          payment_config: Json;
          store_config: Json;
          theme_config: Json | null;
          logo_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          organization_id: string;
          currency?: string;
          timezone?: string;
          store_name?: string | null;
          store_enabled?: boolean;
          store_domain?: string | null;
          pos_config?: Json;
          notification_config?: Json;
          payment_config?: Json;
          store_config?: Json;
          theme_config?: Json | null;
          logo_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<
          Database['public']['Tables']['organization_settings']['Insert']
        >;
      };
      parties: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: string;
          party_type: string | null;
          email: string | null;
          phone: string | null;
          mobile: string | null;
          address: string | null;
          notes: string | null;
          balance: number;
          gst_number: string | null;
          billing_address: Json;
          shipping_address: Json;
          wallet_balance: number;
          loyalty_points: number;
          metadata: Json;
          credit_limit: number;
          credit_limit_enabled: boolean;
          deleted_at: string | null;
          due_date: string | null;
          last_reminder_sent_at: string | null;
          reminder_count: number;
          sms_opt_in: boolean;
          email_opt_in: boolean;
          whatsapp_opt_in: boolean;
          notifications_enabled: boolean;
          display_id: string | null;
          user_id: string | null;
          auth_id: string | null;
          created_by: string | null;
          data_processing_consent: boolean;
          marketing_consent: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          type?: string;
          party_type?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          address?: string | null;
          notes?: string | null;
          balance?: number;
          gst_number?: string | null;
          billing_address?: Json;
          shipping_address?: Json;
          wallet_balance?: number;
          loyalty_points?: number;
          metadata?: Json;
          credit_limit?: number;
          credit_limit_enabled?: boolean;
          deleted_at?: string | null;
          due_date?: string | null;
          display_id?: string | null;
          user_id?: string | null;
          created_by?: string | null;
          data_processing_consent?: boolean;
          marketing_consent?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['parties']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          icon: string | null;
          is_active: boolean;
          tax_config: Json;
          cgst_rate: number | null;
          sgst_rate: number | null;
          igst_rate: number | null;
          gst_rate: number | null;
          parent_id: string | null;
          deleted_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          icon?: string | null;
          is_active?: boolean;
          tax_config?: Json;
          cgst_rate?: number | null;
          sgst_rate?: number | null;
          igst_rate?: number | null;
          gst_rate?: number | null;
          parent_id?: string | null;
          deleted_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          name_secondary: string | null;
          sku: string | null;
          hsn: string | null;
          barcode: string;
          unit: string;
          selling_price: number;
          purchase_price: number;
          mrp: number;
          stock_quantity: number;
          tax_rate: number;
          category_id: string | null;
          image_url: string | null;
          images: Json;
          description: string | null;
          is_active: boolean;
          is_inventory_tracked: boolean;
          has_variants: boolean;
          item_type: string;
          low_stock_threshold: number;
          deleted_at: string | null;
          expiry_date: string | null;
          mfg_date: string | null;
          batch_id: string | null;
          featured_products: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          name_secondary?: string | null;
          sku?: string | null;
          hsn?: string | null;
          barcode: string;
          unit?: string;
          selling_price?: number;
          purchase_price?: number;
          mrp?: number;
          stock_quantity?: number;
          tax_rate?: number;
          category_id?: string | null;
          image_url?: string | null;
          images?: Json;
          description?: string | null;
          is_active?: boolean;
          is_inventory_tracked?: boolean;
          has_variants?: boolean;
          item_type?: string;
          low_stock_threshold?: number;
          deleted_at?: string | null;
          expiry_date?: string | null;
          mfg_date?: string | null;
          batch_id?: string | null;
          featured_products?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string | null;
          party_id: string | null;
          invoice_number: string;
          invoice_sequence: number | null;
          invoice_type: string;
          status: string;
          payment_status: string;
          payment_method: string;
          payment_details: Json | null;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          total_tax: number;
          total_discount: number;
          received_amount: number;
          change_amount: number;
          packing_charge: number;
          delivery_charge: number;
          tip_amount: number;
          coupon_code: string | null;
          coupon_discount: number;
          tax_details: Json;
          notes: string | null;
          origin: string;
          type: string | null;
          source: string | null;
          is_cancelled: boolean;
          is_synced: boolean;
          place_of_supply: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          customer_address: string | null;
          table_number: string | null;
          token_number: number | null;
          delivery_info: Json | null;
          delivery_status: string | null;
          created_by: string | null;
          updated_by: string | null;
          idempotency_key: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          customer_id?: string | null;
          party_id?: string | null;
          invoice_number: string;
          invoice_sequence?: number | null;
          invoice_type?: string;
          status?: string;
          payment_status?: string;
          payment_method?: string;
          payment_details?: Json | null;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          total_tax?: number;
          total_discount?: number;
          received_amount?: number;
          change_amount?: number;
          packing_charge?: number;
          delivery_charge?: number;
          tip_amount?: number;
          coupon_code?: string | null;
          coupon_discount?: number;
          tax_details?: Json;
          notes?: string | null;
          origin?: string;
          type?: string | null;
          source?: string | null;
          is_cancelled?: boolean;
          is_synced?: boolean;
          place_of_supply?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          customer_email?: string | null;
          customer_address?: string | null;
          table_number?: string | null;
          token_number?: number | null;
          delivery_info?: Json | null;
          delivery_status?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          idempotency_key?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          organization_id: string;
          product_id: string | null;
          product_name: string;
          name: string | null;
          name_secondary: string | null;
          description: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          subtotal: number;
          tax_amount: number;
          tax_rate: number;
          hsn: string | null;
          gst_rate: number;
          gst_amount: number;
          discount_amount: number;
          mrp: number;
          batch_id: string | null;
          variant_id: string | null;
          serial_number: string | null;
          warranty_info: string | null;
          is_returned: boolean;
          metadata: Json;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          organization_id: string;
          product_id?: string | null;
          product_name: string;
          name?: string | null;
          name_secondary?: string | null;
          description?: string | null;
          quantity?: number;
          unit_price: number;
          total_price: number;
          subtotal?: number;
          tax_amount?: number;
          tax_rate?: number;
          hsn?: string | null;
          gst_rate?: number;
          gst_amount?: number;
          discount_amount?: number;
          mrp?: number;
          batch_id?: string | null;
          variant_id?: string | null;
          serial_number?: string | null;
          warranty_info?: string | null;
          is_returned?: boolean;
          metadata?: Json;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          organization_id: string;
          reference_type: string;
          reference_id: string;
          amount: number;
          method: string | null;
          payment_method: string | null;
          payment_flow: 'IN' | 'OUT' | null;
          status: string;
          order_id: string | null;
          metadata: Json;
          created_by: string | null;
          idempotency_key: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          reference_type?: string;
          reference_id: string;
          amount: number;
          method?: string | null;
          payment_method?: string | null;
          payment_flow?: 'IN' | 'OUT' | null;
          status?: string;
          order_id?: string | null;
          metadata?: Json;
          created_by?: string | null;
          idempotency_key?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          party_id: string;
          type: 'received' | 'given';
          amount: number;
          date: string;
          description: string | null;
          reference_number: string | null;
          order_id: string | null;
          reminder_sent: boolean;
          reminder_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          party_id: string;
          type: 'received' | 'given';
          amount: number;
          date: string;
          description?: string | null;
          reference_number?: string | null;
          order_id?: string | null;
          reminder_sent?: boolean;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['credit_transactions']['Insert']
        >;
      };
      bill_config: {
        Row: {
          id: string;
          organization_id: string;
          header_text: string | null;
          footer_text: string | null;
          show_logo: boolean;
          show_tax_details: boolean;
          font_size: string;
          paper_size: string;
          logo_url: string | null;
          print_qr_code: boolean;
          qr_code_data: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          header_text?: string | null;
          footer_text?: string | null;
          show_logo?: boolean;
          show_tax_details?: boolean;
          font_size?: string;
          paper_size?: string;
          logo_url?: string | null;
          print_qr_code?: boolean;
          qr_code_data?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['bill_config']['Insert']>;
      };
      purchase_orders: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          order_number: string;
          vendor_name: string | null;
          vendor_phone: string | null;
          vendor_id: string | null;
          party_id: string | null;
          vendor_address: string | null;
          order_date: string;
          total_quantity: number;
          total_amount: number;
          paid_amount: number;
          notes: string | null;
          status: string | null;
          workflow_status: string;
          payment_status: string;
          expected_delivery_date: string | null;
          is_received: boolean;
          idempotency_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          order_number: string;
          vendor_name?: string | null;
          vendor_phone?: string | null;
          vendor_id?: string | null;
          party_id?: string | null;
          vendor_address?: string | null;
          order_date?: string;
          total_quantity?: number;
          total_amount?: number;
          paid_amount?: number;
          notes?: string | null;
          status?: string | null;
          workflow_status?: string;
          payment_status?: string;
          expected_delivery_date?: string | null;
          is_received?: boolean;
          idempotency_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['purchase_orders']['Insert']
        >;
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_id: string;
          product_name: string;
          sku: string | null;
          quantity: number;
          unit: string | null;
          unit_price: number;
          total_price: number;
          batch_id: string | null;
          batch_number: string | null;
          expiry_date: string | null;
          mfg_date: string | null;
          requested_quantity: number | null;
          received_quantity: number;
          item_status: string;
          selling_price: number;
          mrp: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          product_id: string;
          product_name: string;
          sku?: string | null;
          quantity: number;
          unit?: string | null;
          unit_price: number;
          total_price: number;
          batch_id?: string | null;
          batch_number?: string | null;
          expiry_date?: string | null;
          mfg_date?: string | null;
          requested_quantity?: number | null;
          received_quantity?: number;
          item_status?: string;
          selling_price?: number;
          mrp?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['purchase_order_items']['Insert']
        >;
      };
      batches: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          product_id: string;
          batch_number: string;
          quantity: number;
          purchase_price: number;
          selling_price: number | null;
          mrp: number | null;
          mfg_date: string | null;
          expiry_date: string | null;
          variant_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          product_id: string;
          batch_number: string;
          quantity?: number;
          purchase_price?: number;
          selling_price?: number | null;
          mrp?: number | null;
          mfg_date?: string | null;
          expiry_date?: string | null;
          variant_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['batches']['Insert']>;
      };
      stock_ledger: {
        Row: {
          id: string;
          organization_id: string;
          product_id: string;
          batch_id: string | null;
          variant_id: string | null;
          quantity_change: number;
          movement_type: string;
          reference_id: string | null;
          notes: string | null;
          created_by: string | null;
          idempotency_key: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          product_id: string;
          batch_id?: string | null;
          variant_id?: string | null;
          quantity_change: number;
          movement_type: string;
          reference_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          idempotency_key?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['stock_ledger']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          is_read: boolean;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          is_read?: boolean;
          data?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['notifications']['Insert']
        >;
      };
      organization_sequences: {
        Row: {
          organization_id: string;
          sequence_type: string;
          last_value: number;
          updated_at: string | null;
        };
        Insert: {
          organization_id: string;
          sequence_type: string;
          last_value?: number;
          updated_at?: string | null;
        };
        Update: Partial<
          Database['public']['Tables']['organization_sequences']['Insert']
        >;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
