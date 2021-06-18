import { CkanGroup } from "./CkanGroup";
import { CkanOrganization } from "./CkanOrganization";
import { CkanResource } from "./CkanRresource";
import { CkanTag } from "./CkanTag";

export interface CkanPackage {
  author: string;
  author_email: string;
  creator_user_id: string;
  id: string;
  isopen: boolean;
  license_id?: string;
  license_title?: string;
  license_url?: string;
  maintainer?: string;
  maintainer_email?: string;
  metadata_created: string;
  metadata_modified?: string;
  name: string;
  notes?: string;
  num_resources?: number;
  num_tags?: number;
  organization?: CkanOrganization;
  owner_org?: string;
  private?: boolean;
  state?: string;
  title: string;
  type?: string;
  url?: string;
  version?: string;
  groups?: CkanGroup[];
  resources?: CkanResource[];
  tags?: CkanTag[];
  extras?: any[];
  relationships_as_subject?: any[];
  relationships_as_object?: any[];
}
