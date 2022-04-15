export const VERSION = [0, 1, 0];

export const groupAdminCommands = [
  { command: "theme", description: "Change color theme" },
  { command: "font", description: "Change font" },
  { command: "as_doc", description: "Toggle 'Send as document'" },
  { command: "stats", description: "Chat Stats" },
];

export const commands = [
  ...groupAdminCommands,
  { command: "start", description: "Check whether I am alive" },
];
