export {}
declare global{
  interface Video {
    id: number,
    name: string
  }
  
   interface VideoLog {
    id: number,
    ip: string,
    createdAt: string,
  }
}