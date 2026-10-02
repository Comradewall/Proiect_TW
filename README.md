
# Proiect TW Craciun Silviu-Mihai 631AB

# DevTrack
A collaborative task management application designed for software development teams.
It helps developers organize, track, and complete project tasks efficiently.

## Data model

| Field | Type | Notes |
| :--- | :--- | :--- |
| Task Title | text | required, max 100 chars |
| Completed | boolean | toggled from the list, default false |
| Priority | fixed values | Low, Medium, High |
| Module | relation | Frontend, Backend, Database |
| Assignee | relation | the owner of the item (from week 11) |

Sample data used across all stages:
1. "Design database schema", active, High
2. "Write API documentation", done, Medium
3. "Create React components", active, Low

## How to run
Open `index.html` in a browser. No build step, no server.

## AI usage

| Tool | Used for |
| :--- | :--- |
| Gemini | Generating initial README structure. |

Details per stage:
* Stage 1: Used Gemini to define the data model for the Kanban theme and generate the initial `README.md` structure. See the `ai-log/etapa-01.md` file for details.