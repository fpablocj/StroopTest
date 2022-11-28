import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Filesystem, Directory} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import * as WebVPPlugin from 'capacitor-video-player';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements AfterViewInit {
  @ViewChild('video') captureElement: any = ElementRef;
  videoPlayer: any;
  videos: any[] = [];
  private VIDEOS_KEY: string = 'videos';


  constructor(public videoServices: VideoService) { }
  async ngAfterViewInit() {
    this.videos = await this.videoServices.loadVideos();
    this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer
  }
  async play(video: any){
    const base64data = await this.videoServices.getVideoUrl(video);
    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: base64data,
      playerId: 'fullscreen',
      componentTag: 'app-lista'
    })
    console.log('reproduciendo')
  }
  async deleteFile(path:any){
    const name = path.substr(path.lastIndexOf('/')+1);

    Filesystem.deleteFile({
      path:name,
      directory: Directory.Data
    });
    this.videos = this.videos.filter(filePath => filePath != path);
      Storage.set({
      key: this.VIDEOS_KEY,
      value:JSON.stringify(this.videos)
    });

  }




}
