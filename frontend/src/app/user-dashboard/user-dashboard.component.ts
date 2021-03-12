import { Component, OnInit, ViewChild } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 }  from 'uuid';
import { Socket } from "ngx-socket-io";
import {ActivatedRoute} from "@angular/router";
interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  
  currentUserId:string = uuidv4();
  videos: VideoElement[] = [];
 // @ViewChild('myvideo') myvideo:any; 
 anotherid; 
 //peer;
 peerid;
  username = '';
  constructor(private myService:MyserviceService,
  private _router: Router,private route: ActivatedRoute,private socket: Socket,) { 
    
    this.myService.getUserName()
    .subscribe(
      data => this.username= data.toString(),
      error => this._router.navigate(['/main/login'])
    )
  }

  ngOnInit() {
    //let video = this.myvideo.nativeElements;
    const peer = new Peer(this.currentUserId, {
     
      host: 'localhost',
      port: 443,
      path: '/peerjs'
  });
  setTimeout(() => {
    this.peerid=peer.id;
  }, 3000);
  /*this.peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });*/
  
  this.route.params.subscribe((params) => {
    console.log(params);

    peer.on('open', userId => {
      this.socket.emit('join-room', params.roomId, userId);
      
    });
  });
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
    .catch((err) => {
      console.error('[Error] Not able to retrieve user media:', err);
      return null;
    })
    .then((stream: MediaStream | null) => {
      if (stream) {
        this.addMyVideo(stream);
      }

      peer.on('call', (call) => {
        console.log('receiving call...', call);
        call.answer(stream);

        call.on('stream', (otherUserVideoStream: MediaStream) => {
          console.log('receiving other stream', otherUserVideoStream);
          this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });

        call.on('error', (err) => {
          console.error(err);
        })
      });
      this.socket.on('user-connected', (userId) => {
        console.log('Receiving user-connected event', `Calling ${userId}`);

        // Let some time for new peers to be able to answer
        setTimeout(() => {
          const call = peer.call(userId, stream, {
            metadata: { userId: this.currentUserId },
          });
          call.on('stream', (otherUserVideoStream: MediaStream) => {
            console.log('receiving other user stream after his connection');
            this.addOtherUserVideo(userId, otherUserVideoStream);
          });

          call.on('close', () => {
            this.videos = this.videos.filter((video) => video.userId !== userId);
          });
        }, 1000);
      });
    })
    this.socket.on('user-disconnected', (userId) => {
      console.log(`receiving user-disconnected event from ${userId}`)
      this.videos = this.videos.filter(video => video.userId !== userId);
    });
  
  
  }

  logout(){
    localStorage.removeItem('token');
    this._router.navigate(['/main/login']);
  }
  /*conect()
  {
    

    var conn = this.peer.connect(this.anotherid);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function(){
      // here you have conn.id
      conn.send('hi!');
    });


  }
  videocall()
  {
   //let video = this.myvideo.nativeElements;
   var localvar=this.peer;
   var fname=this.anotherid;
   //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   var n=<any>navigator;
   n.getUserMedia=n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
   n.getUserMedia({video:true,audio:true},function (stream) {
     var call=localvar.call(fname,stream);
     call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
      //video.src=URL.createObjectURL(remoteStream);
     // video.play();
    });
   },function (err) {
    console.log(err);
  })
  }*/

  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.anotherid
    });
  }
  addOtherUserVideo(userId: string, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.userId === userId);
    if (alreadyExisting) {
      console.log(this.videos, userId);
      return;
    }
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId,
    });
  }
  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }
}
