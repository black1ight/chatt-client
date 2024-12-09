const useGetLAstTimeOfMessage = (data: Date) => {
  if (
    new Date().getDate() - new Date(data).getDate() > 1 ||
    new Date().getDate() - new Date(data).getDate() < 0
  )
    return 'longAgo'
  if (new Date(data).getDate() == new Date().getDate()) return 'today'
  if (
    new Date().getDate() !== new Date(data).getDate() &&
    new Date(data).getDay() >= 0 &&
    new Date(data).getDay() < new Date().getDay()
  )
    return 'toweek'
}

export default useGetLAstTimeOfMessage
