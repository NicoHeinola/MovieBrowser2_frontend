import type WebsiteTag from "./websiteTag";

export default interface Website {
  id?: number;
  title?: string;
  description?: string;
  url?: string;
  icon?: string;

  tags?: WebsiteTag[];
}
