/*eslint-disable */
var template = `<div class="countdown">
  	<div class="bloc-time days" data-init-value="0">

      <div class="figure days days-1" >
        <span class="top">0</span>
        <span class="top-back">
          <span>1</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>0</span>
        </span>
      </div>


      <div class="figure days days-2">
        <span class="top">0</span>
        <span class="top-back">
          <span>0</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>0</span>
        </span>
      </div>
      <div class="count-title">天</div>
  	</div>

   <div class="bloc-time hours" data-init-value="0">
      <div class="figure hours hours-1">
        <span class="top">0</span>
        <span class="top-back">
          <span>2</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>2</span>
        </span>
      </div>

      <div class="figure hours hours-2">
        <span class="top">0</span>
        <span class="top-back">
          <span>4</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>4</span>
        </span>
      </div>
      <div class="count-title">时</div>
    </div>

    <div class="bloc-time min" data-init-value="0">


      <div class="figure min min-1">
        <span class="top">0</span>
        <span class="top-back">
          <span>0</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>0</span>
        </span>
      </div>

      <div class="figure min min-2">
       <span class="top">0</span>
        <span class="top-back">
          <span>0</span>
        </span>
        <span class="bottom">0</span>
        <span class="bottom-back">
          <span>0</span>
        </span>
      </div>
      <div class="count-title">分</div>
    </div>

    <div class="bloc-time sec" data-init-value="0">


        <div class="figure sec sec-1">
	        <span class="top">0</span>
	        <span class="top-back">
	          <span>0</span>
	        </span>
	        <span class="bottom">0</span>
	        <span class="bottom-back">
	          <span>0</span>
	        </span>
	      </div>

      	<div class="figure sec sec-2">
	        <span class="top">0</span>
	        <span class="top-back">
	          <span>0</span>
	        </span>
	        <span class="bottom">0</span>
	        <span class="bottom-back">
	          <span>0</span>
	        </span>
	    </div>
	    <div class="count-title">秒</div>
    </div>
  </div>
</div>`
var Countdown = {
	  // Backbone-like structure
	  $el: $('.countdown'),
	  // Params
	  countdown_interval: null,
	  total_seconds     : 0,
	  // Initialize the countdown  domElement,endDate
	  init: function(sourceDom, endDate,onTimeEnd, onLeftFiveMin,nowDate) {
      console.log('wk',onTimeEnd)
	  	if( window.countdown_interval){
	  		console.log("clear count down");
	  		clearInterval( window.countdown_interval);
	  	}

	  	if(this.$el.length==0){
	  		 this.$el=$(sourceDom);
	  	}
	    $(sourceDom).html('').html(template);
		// DOM
			this.$ = {
			days: $(sourceDom).find('.bloc-time.days .figure'),
	    	hours  : $(sourceDom).find('.bloc-time.hours .figure'),
	    	minutes: $(sourceDom).find('.bloc-time.min .figure'),
	    	seconds: $(sourceDom).find('.bloc-time.sec .figure')
	   	};
	    // Init countdown values  获取倒计时时间
        
	      var EndTime= new Date(endDate);
          nowDate=nowDate||new Date().getTime();
		    var NowTime = new Date(nowDate);
		    var t =EndTime.getTime() - NowTime.getTime();
		    var d=0;
		    var h=0;
		    var m=0;
		    var s=0;
		    if(t>=0){
		      d=Math.floor(t/1000/60/60/24);
		      h=Math.floor(t/1000/60/60%24);
		      m=Math.floor(t/1000/60%60);
		      s=Math.floor(t/1000%60);
			}

		    this.$.days.parent().attr('data-init-value',d);
		    this.$.hours.parent().attr('data-init-value',h);
		    this.$.minutes.parent().attr('data-init-value',m);
		    this.$.seconds.parent().attr('data-init-value',s);

	   // Init countdown values
	   this.values = {
	    	  days: this.$.days.parent().attr('data-init-value'),
		      hours  : this.$.hours.parent().attr('data-init-value'),
	        minutes: this.$.minutes.parent().attr('data-init-value'),
	        seconds: this.$.seconds.parent().attr('data-init-value'),
	    };
//	      console.log( this.values.days)
	    // Initialize total seconds
	    this.total_seconds = parseInt(t/1000);
	    // Animate countdown to the end
      this.count(onTimeEnd,onLeftFiveMin);
	  },
	  count: function(onTimeEnd,onLeftFiveMin) {
	    var that    = this,
	    	$day_1 = this.$.days.eq(0),
	    	$day_2 = this.$.days.eq(1),
	        $hour_1 = this.$.hours.eq(0),
	        $hour_2 = this.$.hours.eq(1),
	        $min_1  = this.$.minutes.eq(0),
	        $min_2  = this.$.minutes.eq(1),
	        $sec_1  = this.$.seconds.eq(0),
	        $sec_2  = this.$.seconds.eq(1);
	        window.countdown_interval = this.countdown_interval = setInterval(function() {
	        if(that.total_seconds > 0) {
	            --that.values.seconds;
//	            console.log(that.values.seconds)
              if(that.values.seconds < 0){
                that.values.seconds = 0
              }
	            if(that.values.minutes >= 0 && that.values.seconds <= 0) {
                  if (that.values.minutes > 0) {
                    that.values.seconds = 59;
                  }
                  if(that.values.minutes > 0) {
	                  --that.values.minutes;
                  }
	            }
	            if(that.values.hours >= 0 && that.values.minutes <= 0 && that.values.seconds <= 0) {
                  if (that.values.hours > 0) {
                    that.values.minutes = 59;
                    that.values.seconds = 59;
                  }
                  if(that.values.hours > 0) {
	                  --that.values.hours;
                  }
	            }
	            if(that.values.days >= 0 && that.values.hours <= 0 && that.values.minutes <= 0 && that.values.seconds <= 0){
                  // fix by songhlc
                  if(that.values.days > 0) {
	                  --that.values.days;
                    that.values.hours = 23;
                    that.values.minutes = 59;
                    that.values.seconds = 59;
                  }
	            }
              if(that.total_seconds == 300 && onLeftFiveMin && typeof onLeftFiveMin == 'function') {
                onLeftFiveMin()
              }
	            // Update DOM values
	            //days
	            that.checkHour(that.values.days, $day_1, $day_2);
	            // Hours
	            that.checkHour(that.values.hours, $hour_1, $hour_2);
	            // Minutes
	            that.checkHour(that.values.minutes, $min_1, $min_2);
	            // Seconds
	            that.checkHour(that.values.seconds, $sec_1, $sec_2);
	            --that.total_seconds;
	        }else if(that.total_seconds <= 0) {
            that.values.seconds = 0;
	          clearInterval(that.countdown_interval);
            if(onTimeEnd && typeof onTimeEnd == 'function') {
              onTimeEnd()
            }
	        }
	    }, 1000);
	  },
	  animateFigure: function($el, value) {
	     var that         = this,
			     $top         = $el.find('.top'),
	         $bottom      = $el.find('.bottom'),
	         $back_top    = $el.find('.top-back'),
	         $back_bottom = $el.find('.bottom-back');
	    // Before we begin, change the back value
	    $back_top.find('span').html(value);
	    // Also change the back bottom value
	    $back_bottom.find('span').html(value);
	    // Then animate
	    TweenMax.to($top, 0.8, {
	        rotationX           : '-180deg',
	        transformPerspective: 300,
		      ease                : Quart.easeOut,
	        onComplete          : function() {

	            $top.html(value);

	            $bottom.html(value);

	            TweenMax.set($top, { rotationX: 0 });
	        }
	    });
	    TweenMax.to($back_top, 0.8, {
	        rotationX           : 0,
	        transformPerspective: 300,
		      ease                : Quart.easeOut,
	        clearProps          : 'all'
	    });
	  },
	  checkHour: function(value, $el_1, $el_2) {
	    var val_1       = value.toString().charAt(0),
	        val_2       = value.toString().charAt(1),
	        fig_1_value = $el_1.find('.top').html(),
	        fig_2_value = $el_2.find('.top').html();
	    if(value >= 10) {
	        // Animate only if the figure has changed
	        if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
	        if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
	    }
	    else {
	        // If we are under 10, replace first figure with 0
	        if(fig_1_value !== '0') this.animateFigure($el_1, 0);
	        if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
	    }
	  }
	};
	export default Countdown
/*eslint-disable */
