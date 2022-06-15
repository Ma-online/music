
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next') 
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')








const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat :false,

    songs: [
        {
            name: 'Abcdef',
            singer: 'gayle',
            path : './music/abcdefu - GAYLE _ TIED.mp3',
            image: './img/anime.jpg',
        },
        {
            name: 'ただ声一つ',
            singer: ' ロクデナシ',
            path : './music/ただ声一つ - ロクデナシ .mp3',
            image: './img/ただ声一つ.jpg',
        },
        {
            name: 'Britney Spears',
            singer: 'Criminal',
            path : './music/Britney Spears - Criminal.mp3',
            image: './img/Britney_Spears_Criminal.jpg',
        },
        {
            name: 'Cash',
            singer: 'Hero',
            path : './music/Cash Cash - Hero.mp3',
            image: './img/Cash Cash.jpg',
        },
        {
            name: 'Symphony',
            singer: 'Clean Bandit',
            path : './music/Clean Bandit - Symphony.mp3',
            image: './img/Clean Bandit - Symphony.jpg',
        },
        {
            name: 'Sold Out',
            singer: 'Hawk Nelson',
            path : './music/Hawk Nelson - Sold Out.mp3',
            image: './img/Hawk Nelson - Sold Out.jpg',
        },
        {
            name: 'Lemon',
            singer: 'Kenshi',
            path : './music/Lemon - Kenshi Yonezu.mp3',
            image: './img/Lemon - Kenshi Yonezu.jpg',
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path : './music/Sia - Unstoppable.mp3',
            image: './img/Sia - Unstoppable.jpg',
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'ZAYN',
            path : './music/ZAYN - Dusk Till Dawn.mp3',
            image: './img/ZAYN - Dusk Till Dawn.jpg',
        },
        
    ],

    render: function(){
        
        const htmls = this.songs.map((song , index) =>{
            
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
          `
        })
       
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        // tìm hiểu thêm
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        

        // Xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000 ,//10s
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        // xử lý phong to / thu nhỏ CD
        document.onscroll = function(){
           const scrollTop = window.scrollY;
           const newCdwidth = cdWidth - scrollTop
             //if(!_this.nextSong()){
                cd.style.width = newCdwidth > 0 ? newCdwidth+'px': 0
                cd.style.opacity = newCdwidth / cdWidth
            // }else{
                 //cd.style.width = cdWidth
            // }

           
           
        }
        // xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song được pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua song
        progress.onchange = function(){
            const seekTime = audio.duration/100 * progress.value
            audio.currentTime = seekTime
        }
        // khi next song
        nextBtn.onclick = function(){
           if(_this.isRandom){
                _this.playRandomSong()
           }else{
                _this.nextSong()               
           }
           audio.play()
           _this.render()
           _this.scrollToActiveSong()
           
        }
        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                 _this.prevSong()
            }
           
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }
        //xử lý bật tắt random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
            
        }
        // Xử lý lặp lại một song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active')
           if(songNode || e.target.closest('.option')){
                // Xử lý khi click vào song
                
                if(songNode){
                    //console.log(songNode.getAttribute('data-index')) // cách 2 dataset.index
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
            }
                // Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
           }
        }

        
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "center",
            
          });
        }, 300);
    },
    loadCurrentSong: function(){
   

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },  
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
            
        }while (newIndex === this.currentIndex)
     
        this.currentIndex = newIndex
        
        this.loadCurrentSong()
        
    },
    start: function(){       
        // định nghĩa các thuộc tính cho object
        this.defineProperties()
        // lắng nghe /  xử lý các sự kiện
        this.handleEvents()
        // bài hát hiện tại
        this.loadCurrentSong()
        //Render playlist
        this.render()
    }
}

app.start()