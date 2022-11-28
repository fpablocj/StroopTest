import { Injectable } from '@angular/core';
import { Filesystem, Directory} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videos: any[] = [];
  private VIDEOS_KEY: string = 'videos';
  public nombre: string="";
  private videoList: any;

  constructor() { }
  
  async loadVideos(){
    this.videoList = await Storage.get({key: this.VIDEOS_KEY});
    this.videos = JSON.parse(this.videoList.value) || [];
    return this.videos;
  }
  async getVideoUrl(fullPath: any){
    const path = fullPath.substr(fullPath.lastIndexOf('/')+1);
    let file = await Filesystem.readFile({
      path: path,
      directory:  Directory.Data
    });
    return `data:video/mp4;base64,${file.data}`;
  }



//base64 to file



}
