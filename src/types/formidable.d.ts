declare module "formidable" {
  import type { IncomingMessage } from "http";

  export interface File {
    filepath: string;
    originalFilename?: string | null;
    mimetype?: string | null;
    size?: number;
  }

  export interface Fields {
    [key: string]: unknown;
  }

  export interface Files {
    [key: string]: File | File[];
  }

  export interface Options {
    multiples?: boolean;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
  }

  export interface IncomingForm {
    parse(
      req: IncomingMessage,
      callback: (err: unknown, fields: Fields, files: Files) => void
    ): void;
  }

  export default function formidable(options?: Options): IncomingForm;
}

