export interface Task {
  id: string;
  title: string;
  role: string;
  constraint?: string;
  input: string[];
  tool: string;
  output: string;
  checklist?: string[];
  description: string;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Group {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

export interface PlaybookData {
  groups: Group[];
}
