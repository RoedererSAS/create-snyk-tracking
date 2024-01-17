type Issue = {
  id: string
}

export interface IssuecreatorInterface {
  listIssues(): void
  isIssueInList(listIssue: Issue[]): void
  createIssue(title: string, body: string): void
}
