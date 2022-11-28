import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {interval} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoService } from '../services/video.service';
import { Filesystem, Directory} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import * as WebVPPlugin from 'capacitor-video-player';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component implements AfterViewInit {
  @ViewChild('video') captureElement: any = ElementRef;
  mediaRecorder:any = MediaRecorder;
  videoPlayer: any;
  isRecording = false;
  videos: any[] = [];
  nombre: string = "";
  private VIDEOS_KEY: string = 'videos';

  cuenta:number=45;
  cuentai:number=3;

  cont: any;
  cont2: any;
  pantalla:number=1;
  comenzar:boolean=false;
  siguiente: boolean=true;
  accion: boolean=false;
  next: string="Siguiente Test";
  cerrar: boolean=true;
  error: string=""
  namefile: number=1;
  ban:boolean=false;
  mensaje: string = "¡Tiempo Terminado!"
  opcion: string = "Continuar"

  constructor(public modal: NgbModal, public videoServices: VideoService, private changeDetector: ChangeDetectorRef) {
   }
  async ngAfterViewInit() {
    this.videos = await this.videoServices.loadVideos();
    this.videoPlayer = WebVPPlugin.CapacitorVideoPlayer
  }
  async storeVideo(blob: any){
    const filename = this.nombre+'_'+"Test"+this.namefile+'_'+new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate()+'_'+new Date().getHours()+':'+new Date().getMinutes()+'.mp4';
    const base64Data = await this.convertBlobToBase64(blob) as string;
    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Data
    });
    this.videos.unshift(savedFile.uri);

    console.log('Mi Array de Videos: ', this.videos);

    return Storage.set({
      key: this.VIDEOS_KEY,
      value:JSON.stringify(this.videos)
    });
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async recordVideo(){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: true
    });
    this.captureElement.nativeElement.srcObject = stream;

    var options = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(stream, options);
    let chunks:any = [];

    this.mediaRecorder.onstop = async (event: any) =>{
      const videoBuffer = new Blob(chunks, {type: 'video/webm'})
      await this.storeVideo(videoBuffer);

      this.videos=this.videoServices.videos;
      this.changeDetector.detectChanges();
    }

    this.mediaRecorder.ondataavailable = (event: any) =>{
      if (event.data && event.data.size > 0){
        chunks.push(event.data)
      }
    }

    this.mediaRecorder.start(100);
    this.isRecording = true;

  }
  stopRecord(){
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }

  inicio(contenido2: any, contenido: any, contenido3:any){
    this.modal.open(contenido2,{centered:true});
    var contador2 = interval(300);
    this.recordVideo();
    this.cont2 = contador2.subscribe(()=>{
      this.cuentai--

      if(this.cuentai==0){
        this.modal.dismissAll(contenido2);
        this.cont2.unsubscribe();
        this.empezar(contenido, contenido3);
      }

    })
  }
  empezar(contenido: any, contenido3:any){
    this.cuentai=3;
    this.siguiente=false;
    this.comenzar=true;
    var contador = interval(1000);
    this.cont = contador.subscribe(()=>{
      this.cuenta--

      if(this.cuenta==-1){
        this.modal.open(contenido,{centered:true});
        this.stopRecord;
        this.limpiar()
        this.disp(contenido, contenido3)
      }
      return;
    })
    this.accion=false;
  }
  contar(contenido:any, contenido2: any, contenido3:any){
    this.inicio(contenido2, contenido, contenido3);


  }
  v(){
    if(this.nombre==""){
      this.error="No ha ingresado el nombre"
    }else{
      this.cerrar=false;
    }

  }
  limpiar(){
    this.cont.unsubscribe();
    this.cuenta=45;
  }
 disp(contenido: any, contenido3: any){
  this.stopRecord();
  this.siguiente=true;
  this.comenzar=false;
  if(this.pantalla==4){
    this.namefile=4
    this.comenzar=true;
    this.siguiente=true
    this.mensaje="¡Test Finalizado con éxito!"
    this.opcion="Ver Resultados"
    this.modal.open(contenido,{centered:true});
  }

  if(this.pantalla==3){
    this.pantalla=4
    this.next="Finalizar Test"
    this.namefile=3
    this.modal.open(contenido3,{centered:true});
    this.limpiar();
    return;
  }
  if(this.pantalla==2){
    this.pantalla=3
    this.namefile=2
    this.modal.open(contenido3,{centered:true});
    this.limpiar();
    return;
  }
  if(this.pantalla==1){
    this.pantalla=2;
  }
  this.limpiar();
  this.modal.open(contenido3,{centered:true});
 }


}
