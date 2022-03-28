export interface Report {
    info: string
    reported_id: string
    reported_type: ReportedType
    reporter_id: string
    type: ReportType
}

enum ReportType {
    badImage = 0,
    badInfo = 1,
    badLocation = 2,
    badName = 3,
}

enum ReportedType {
    place = 0,
    user = 1,
}