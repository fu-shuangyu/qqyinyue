document.addEventListener("readystatechange",function(){
	if(document.readyState === "complete"){
		//���Ӷ��ѣ�����ʵ
		// var obj = {a:1,b:2}
		// el.click = function(){
		// 	obj.a = 4;
		// }
		// obj.onAchange = function(){
		// 	div.style.height=16*this.a +'px';
		// }

		//��������
		audio = document.querySelector('audio');
		var playpausebtn = document.querySelector('#btnplay');
		var vol = document.querySelector('#spanvolume');
		var volPosition = document.querySelector('#spanvolumeop');
		var volumebar = document.querySelector('#spanvolumebar');
		var mute = document.querySelector('#spanmute');
		var state = document.querySelector('#downloadbar');
		var statePositon = document.querySelector('#spanprogress_op');
		var tiaos = document.querySelector('#spanplaybar');
		var currentsongindex;
		var DANQU =1, SHUNXU =2,LIEBIAO =3, SUIJI =4;
		var currentbofangmoshi=LIEBIAO;
		var tip=document.querySelector("#time_show");
		var tips=document.querySelector(".time_show");
		//audio�����ԡ�������ͣ��ť
		playpausebtn.onclick=function(){
			if(audio.paused){
				audio.play();
			}else{
				audio.pause();
			}
		}
		//audio�ķ���
		audio.onplay=function(){
			playpausebtn.classList.add('pause_bt');
			playpausebtn.classList.remove('play_bt');
		}
		audio.onpause=function(){
			playpausebtn.classList.add('play_bt');
			playpausebtn.classList.remove('pause_bt');
		}

		//�����ĸı䲿��
		vol.onclick = function(e){
			var ev = e||window.event;
			var v = ev.offsetX/this.offsetWidth;
			audio.volume = v;
		}
		mute.onclick = (function(){
			var kaiguan = true;
			var oldvolume;
			return function(){
				if(kaiguan){
					oldvolume = audio.volume;
					audio.volume = 0;
					kaiguan = false;
					this.classList.add('volume_mute');
					this.classList.remove('volume_icon');
				}else{
					audio.volume = oldvolume;
					kaiguan = true;
					this.classList.remove('volume_mute');
					this.classList.add('volume_icon');
				}
				
			}
		})();
		audio.onvolumechange = function(){
			if(audio.volume === 0){
				mute.className = 'volume_mute';
			}else{
				mute.className = 'volume_icon';
			}
			volPosition.style.left = audio.volume*100 + '%';
			volumebar.style.width =  audio.volume*100 + '%';
		 }


		//���Ž�����
		state.onclick = function(ev){
			var rate = ev.offsetX/this.offsetWidth*audio.duration;
			audio.currentTime = rate;
		}
		audio.ontimeupdate = function(){
			var l = this.currentTime/this.duration*100;
			statePositon.style.left=l+'%';
			tiaos.style.width =l+'%';
			if(audio.ended){
				if(currentbofangmoshi ==DANQU){
					audio.play();
				}
				else if(currentbofangmoshi ==LIEBIAO){
					nextSong();
				}
				else if(currentbofangmoshi ==SUIJI){
					randomSong();
				}
				else if(currentbofangmoshi ==SHUNXU){
					if (currentsongindex!==yinyueku.length-1) {
						nextSong();
					}else{
						statePositon.style.left=0+'%';
						tiaos.style.width =0+'%';
					}
				}
				
			}
		}
		//ʱ�䣬���Ž������Ĳ���
		state.onmouseover = function(ev){
			tips.style.display = "block";
			tip.style.display = "block";
		}
		state.onmousemove = function(ev){
			tips.style.left= ev.offsetX + 8 + 'px';
			tip.style.left= ev.offsetX + 'px';
			var time = ev.offsetX/this.offsetWidth*audio.duration;
			tip.innerHTML = zhuanhuan(time);
		}
		state.onmouseout = function(ev){
			tips.style.display = "none";
			tip.style.display = "none";
		}
		var zhuanhuan=function(time){
			var fen=parseInt(time/60);
			var miao=parseInt(time%60);
			return fen+":"+miao;
		}

		//���ֿ�Ľ�����д
		var yinyueku = [
		{
			name:'after many years',src:'001.mp3',geshou:'zhaoxin',duration:'4:32'
		},{
			name:'Bacause of you',src:'002.mp3',geshou:'Kelly Clarkson',duration:'3:49'
		},{
			name:'That man',src:'003.mp3',geshou:'zongwei',duration:'4:32'
		},{
			name:'Bubbly',src:'Colbie Caillat - Bubbly.mp3',geshou:'Colbie Caillat',duration:'3:16'
		},{
			name:'Cry On My Shoulder',src:'Deutschland Sucht Den Superstar - Cry On My Shoulder.mp3',geshou:'Deutschland Sucht Den Superstar',duration:'3:56'
		},{
			name:'Burning',src:'Maria Arredondo - Burning.mp3',geshou:'Maria Arredondo',duration:'4:03'
		},{
			name:'I Stay In Love',src:'Mariah Carey - I Stay In Love.mp3',geshou:'Mariah Carey',duration:'3:32'
		}
		];
		
		var drawlist = function(){
			var el ='';
			for (var i = 0; i < yinyueku.length; i++) {
				var ac =(i==currentsongindex)?'play_current':'';
				el += ' <li mid="j'+i+'" class="'+ac+'"><strong class="music_name" title="'+yinyueku[i].name+'">'+yinyueku[i].name+'</strong><strong class="singer_name" title="'+yinyueku[i].geshou+'">'+yinyueku[i].geshou+'</strong><strong class="play_time">'+yinyueku[i].duration+'</strong><div class="list_cp"><strong class="btn_like" title="ϲ��" name="myfav_000hntd91kI1kJ" mid="000hntd91kI1kJ"><span>��ϲ��</span></strong><strong class="btn_share" title="����"><span>����</span></strong><strong class="btn_fav" title="�ղص��赥"><span>�ղ�</span></strong><strong class="btn_del" title="���б���ɾ��"><span>ɾ��</span></strong></div></li>';
			}			
			divsonglist.firstElementChild.innerHTML = el;
			spansongnum1.innerHTML = '<span>'+yinyueku.length+'</span>'
			var lis=divsonglist.firstElementChild.children;
			for (var i = 0; i < lis.length; i++) {
				lis[i].index = i;
				lis[i].onclick = function(){
					audio.src = yinyueku[this.index].src;
					audio.play();
					currentsongindex = this.index;
					onsongchange();
				}
				lis[i].onmouseover = function(){
					this.classList.add('play_hover');
				}
				lis[i].onmouseout = function(){
					this.classList.remove('play_hover');
				}
			}
			//ɾ��һ����
			var dels =document.querySelectorAll('.btn_del');
			for (var i = 0; i < dels.length; i++) {
				dels[i].index=i;
				dels[i].onclick = function(ev){
					ev.stopPropagation();
					var newarr=[];
					for (var j = 0; j < yinyueku.length; j++) {
						if(yinyueku[this.index] != yinyueku[j]){
							newarr.push(yinyueku[j]);
						}
					}
					yinyueku = newarr;
					if(this.index<currentsongindex){
						this.index-=1;
						currentsongindex-=1;
					}
					drawlist();				
					if(this.index==currentsongindex){
						if(this.index==yinyueku.length){
							audio.src='';
							uireset();
						}else{
							audio.src=yinyueku[currentsongindex].src;
							audio.play();
							onsongchange();
						}
					}
					if(yinyueku.length==0){
						divnulllist.style.display = 'block';
					}
				}
			}
		}
		drawlist();
		var onsongchange = function(){
			var lis=divsonglist.firstElementChild.children;
			for (var i = 0; i < lis.length; i++) {
				lis[i].classList.remove('play_current');
			};
			lis[currentsongindex].classList.add('play_current');
			document.querySelector('.music_name span').innerHTML = yinyueku[currentsongindex].name;
			document.querySelector('.singer_name span').innerHTML = yinyueku[currentsongindex].geshou;
			document.querySelector('.play_date').innerHTML = yinyueku[currentsongindex].duration;
			document.querySelector('.music_op').style.display = 'block';
		}

		var nextSong = function(){
			if(currentsongindex==undefined){
				return;
			}
			if(currentbofangmoshi == SUIJI){
				randomSong();
				return;
			}else{
				currentsongindex +=1;
				currentsongindex = (currentsongindex == yinyueku.length)?0:currentsongindex;
				audio.src = yinyueku[currentsongindex].src;
				onsongchange();
				audio.play();
			}
		}
		var prevSong = function(){
			if(currentsongindex==undefined){
				return;
			}
			if(currentbofangmoshi == SUIJI){
				randomSong();
				return;
			}else{
				currentsongindex -=1;
				currentsongindex = (currentsongindex == -1)?(yinyueku.length-1):currentsongindex;
				audio.src = yinyueku[currentsongindex].src;
				onsongchange();
				audio.play();
			}
		}
		var randomSong = function(){
			currentsongindex = Math.floor(Math.random()*yinyueku.length);
			audio.src = yinyueku[currentsongindex].src;
			audio.play();
			onsongchange();
		}
		document.querySelector('.next_bt').onclick = nextSong;
		document.querySelector('.prev_bt').onclick = prevSong;



		//������ģʽ
		btnPlayway.onclick = function (){
			divselect.style.display = 'block';
		}
		setbofangmoshi = function (num){
			currentbofangmoshi=num;
			divselect.style.display = 'none';
			var date={
				1:'cycle_single_bt',   //����ѭ��
				2:'ordered_bt',        //˳�򲥷�
				3:'cycle_bt',          //�б���
				4:'unordered_bt'      //�������
			}
			btnPlayway.className = date[num];
		}
		//������в��Ÿ�����
		clear_list.onclick = function(){
			yinyueku = [];
			drawlist();
			uireset();
			// divnulllist.style.display = 'block';
		}
		var uireset = function(){
			document.querySelector('.music_name').innerHTML = '<span>Listen My Like</span>';
			document.querySelector('.singer_name').innerHTML = '<span>QQmusic</span>';
			document.querySelector('.play_date').innerHTML = '';
			document.querySelector('.music_op').style.display = 'none';
			audio.src = '';
			tiaos.style.width = 0+'%';
			statePositon.style.left = 0 + '%';
			playpausebtn.className = 'play_bt';
			if(yinyueku.length==0){
				divnulllist.style.display = 'block';
			}
		}
		

		//չ�������б�
		var flag = true;
		var flag1 = true;
		spansongnum1.onclick = function(){
			if(flag){
				divplayframe.style.cssText = 'transition:opacity 0.6s ease 0s;opacity:1;z-index:4';
				flag = false;
			}else{
				divplayframe.style.cssText = 'transition:opacity 0.6s ease 0s;opacity:0;';
				flag=true;
			}
		}
		btnfold.onclick = function(){
			if(flag1){
				if(!flag){
					divplayframe.style.cssText = 'transition:opacity 0.3s ease 0s;opacity:0;';
					divplayer.classList.add(".m_player_folded");
					divplayer.style.cssText = 'transition:left 0.6s ease 0.3s;left:-540px;';
				}
					divplayer.style.cssText = 'transition:left 0.6s ease 0s;left:-540px;';
					flag1 = false;
			}else{
				divplayer.style.cssText = 'transition:left 0.6s ease 0s;left:0;';
				divplayer.classList.remove(".m_player_folded");
				flag1 = true;
			}
		}
		divplayer.style.cssText = 'transition:left 0.6s ease 0s;left:0;';
		//�����б�
		btnclose.onclick = function (){
			divplayframe.style.opacity=0;
		}

		//-----------��ֹð�ݵĳ������
		volPosition.onclick = function(ev){
			ev.stopPropagation();
		}
		statePositon.onmouseover=statePositon.onclick = function(ev){
			ev.stopPropagation();
		}
		//���ԣ�
		//src �����ĵ�ַ  ���ĵ�ַ���������һ�׸���
		//paused  ����ֵ ���audio������ͣ״̬���򲼶�ֵΪtrue
		//ended   ����ֵ ���audio���Ž������򲼶�ֵΪtrue
		//currentTime  �����Ĳ��Ž���
		//duration     �������ܲ���ʱ��
		//volume       ��������

		//����
		//onplay   ����
		//onpuase  ��ͣ

		//�¼�
		//ontimeupdate
		//onvolumechange  �������ı�
		//onplay    ���������ŵ�ʱ��
		//onpause   ��������ͣ��ʱ��

		
		
		

		
		// //�и���

		// qiege.onclick=function(){
		// 	audio.src="001.mp3";
		// 	audio.play();
		// 	tiaos.style.width=0+'px';
		// }
		

	}
},false)