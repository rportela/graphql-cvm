export interface CkanGroup {
  approval_status?: string; //Example:	"approved"
  created?: string; //Example:	"2021-04-19T07:46:38.079447"
  description?: string; //Example:	""
  display_name?: string; //Example:	"Test Group"
  id?: string; //Example:	"5d423f6b-137e-4d15-a156-868763fa7a64"
  image_display_url?: string; //Example:	"https://demo.ckan.org/uploads/group/2021-04-21-153504.571229064c7c.png"
  image_url?: string; //Example:	"2021-04-21-153504.571229064c7c.png"
  is_organization?: boolean; //Example:	false
  name?: string; //Example:	"test-group"
  num_followers?: number; //Example:	0
  package_count?: number; //Example:	1
  state?: string; //Example:	"active"
  title?: string; //Example:	"Test Group"
  type: string; //Example:	"group"
}
