export interface CkanResource {
  cache_last_updated?: string;
  cache_url?: string;
  created?: string;
  datastore_active?: boolean;
  description?: string;
  format: string;
  hash?: string;
  id: string;
  last_modified?: string;
  metadata_modified?: string;
  mimetype?: string;
  mimetype_inner?: string;
  name?: string;
  package_id?: string;
  position?: number;
  resource_type?: string;
  size?: number;
  state?: string;
  url: string;
  url_type?: string;
}
