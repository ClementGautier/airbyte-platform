export enum RoutePaths {
  AuthFlow = "/auth_flow",
  Root = "/",

  SpeakeasyRedirect = "speakeasy-redirect",

  Workspaces = "workspaces",
  Setup = "setup",
  Connections = "connections",
  Destination = "destination",
  Source = "source",
  Settings = "settings",

  Connection = "connection",
  ConnectionNew = "new-connection",
  SourceNew = "new-source",
  DestinationNew = "new-destination",

  ConnectorBuilder = "connector-builder",
}

export enum DestinationPaths {
  Root = ":id/*", // currently our tabs rely on this * wildcard to detect which tab is currently active
  Settings = "settings",
  NewDestination = "new-destination",
}

export enum SourcePaths {
  Root = ":id/*", // currently our tabs rely on this * wildcard to detect which tab is currently active
  Settings = "settings",
  NewSource = "new-source",
}
