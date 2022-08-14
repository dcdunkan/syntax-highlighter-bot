export const VERSION = [0, 5, 0];

export const groupAdminCommands = [
  { command: "theme", description: "Change color theme" },
  { command: "font", description: "Change font" },
  { command: "as_doc", description: "Toggle 'Send as document'" },
  { command: "stats", description: "Chat Stats" },
  { command: "toggle_auto_hl", description: "Toggle automatic highlighting" },
];

export const commands = [
  ...groupAdminCommands,
  { command: "start", description: "Check whether I am alive" },
];
