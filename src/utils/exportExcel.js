
import { IDEA_STATUS, PROJECT_STATUS, PRIORITY } from "./labels"

const TASK_STATUS = { TODO: "À faire", DONE: "Terminée" }
const DATE = "dd/mm/yyyy"
const DATETIME = "dd/mm/yyyy hh:mm"
const toDate = (iso) => (iso ? new Date(iso) : null)

const addSheet = (workbook, name, columns, rows) => {
  const sheet = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] })
  sheet.columns = columns
  rows.forEach((row) => sheet.addRow(row))

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: "FFFFFFFF" } }
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8B5CF6" } }
  header.height = 22
  header.alignment = { vertical: "middle" }

  sheet.eachRow((row, number) => {
    if (number > 1) row.alignment = { vertical: "top", wrapText: true }
  })
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } }
}

export const buildExcel = async (data) => {
  const mod = await import("exceljs/dist/exceljs.min.js")
  const ExcelJS = mod.default ?? mod

  const ideas = data.ideas ?? []
  const projects = data.projects ?? []
  const tasks = data.tasks ?? []
  const journals = [...(data.journals ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const ideaTitle = Object.fromEntries(ideas.map((i) => [i.id, i.title]))
  const projectTitle = Object.fromEntries(projects.map((p) => [p.id, p.title]))

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "DevNote"
  workbook.created = new Date()

  addSheet(
    workbook,
    "Idées",
    [
      { header: "Titre", key: "title", width: 32 },
      { header: "Description", key: "description", width: 50 },
      { header: "Catégorie", key: "category", width: 16 },
      { header: "Statut", key: "status", width: 22 },
      { header: "Créée le", key: "createdAt", width: 18, style: { numFmt: DATETIME } },
      { header: "Modifiée le", key: "updatedAt", width: 18, style: { numFmt: DATETIME } },
    ],
    ideas.map((i) => ({
      title: i.title,
      description: i.description ?? "",
      category: i.category ?? "",
      status: IDEA_STATUS[i.status]?.label ?? i.status,
      createdAt: toDate(i.createdAt),
      updatedAt: toDate(i.updatedAt),
    }))
  )

  addSheet(
    workbook,
    "Projets",
    [
      { header: "Titre", key: "title", width: 28 },
      { header: "Description", key: "description", width: 40 },
      { header: "Objectif", key: "objective", width: 32 },
      { header: "Statut", key: "status", width: 14 },
      { header: "Début", key: "startDate", width: 14, style: { numFmt: DATE } },
      { header: "Échéance", key: "deadline", width: 14, style: { numFmt: DATE } },
      { header: "Idée d'origine", key: "idea", width: 28 },
      { header: "Tâches", key: "tasks", width: 10 },
      { header: "Terminées", key: "done", width: 12 },
      { header: "Progression", key: "progress", width: 14, style: { numFmt: "0%" } },
      { header: "Créé le", key: "createdAt", width: 18, style: { numFmt: DATETIME } },
      { header: "Modifié le", key: "updatedAt", width: 18, style: { numFmt: DATETIME } },
    ],
    projects.map((p) => {
      const own = tasks.filter((t) => t.projectId === p.id)
      const done = own.filter((t) => t.status === "DONE").length
      return {
        title: p.title,
        description: p.description ?? "",
        objective: p.objective ?? "",
        status: PROJECT_STATUS[p.status]?.label ?? p.status,
        startDate: toDate(p.startDate),
        deadline: toDate(p.deadline),
        idea: ideaTitle[p.ideaId] ?? "",
        tasks: own.length,
        done,
        progress: own.length ? done / own.length : 0,
        createdAt: toDate(p.createdAt),
        updatedAt: toDate(p.updatedAt),
      }
    })
  )

  addSheet(
    workbook,
    "Tâches",
    [
      { header: "Projet", key: "project", width: 28 },
      { header: "Titre", key: "title", width: 32 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priorité", key: "priority", width: 12 },
      { header: "Statut", key: "status", width: 12 },
      { header: "Créée le", key: "createdAt", width: 18, style: { numFmt: DATETIME } },
      { header: "Modifiée le", key: "updatedAt", width: 18, style: { numFmt: DATETIME } },
    ],
    tasks.map((t) => ({
      project: projectTitle[t.projectId] ?? "",
      title: t.title,
      description: t.description ?? "",
      priority: PRIORITY[t.priority]?.label ?? t.priority,
      status: TASK_STATUS[t.status] ?? t.status,
      createdAt: toDate(t.createdAt),
      updatedAt: toDate(t.updatedAt),
    }))
  )

  addSheet(
    workbook,
    "Journal",
    [
      { header: "Date", key: "createdAt", width: 18, style: { numFmt: DATETIME } },
      { header: "Titre", key: "title", width: 28 },
      { header: "Projet", key: "project", width: 28 },
      { header: "Travail réalisé", key: "achievements", width: 50 },
      { header: "Difficultés", key: "difficulties", width: 40 },
      { header: "Prochaine étape", key: "nextStep", width: 36 },
    ],
    journals.map((j) => ({
      createdAt: toDate(j.createdAt),
      title: j.title,
      project: projectTitle[j.projectId] ?? "",
      achievements: j.achievements ?? "",
      difficulties: j.difficulties ?? "",
      nextStep: j.nextStep ?? "",
    }))
  )

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}