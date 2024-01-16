type Issue = {
  id: string
}

export interface IssueCreatorInterface {
  listIssues(): void
  isIssueInList(listIssue: Issue[]): void
  createIssue(title: string, body: string): void
}
