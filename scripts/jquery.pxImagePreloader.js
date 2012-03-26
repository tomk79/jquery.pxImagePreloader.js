/**
 * jquery.pxImagePreloader.js
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
(function($){
	var conf = {
	};
	var queue = [];//reset

	function classQueueTemplate(targets,opts){
		var index = null;
		var caches = {};
		var progressCount = 0;
		this.targets  = [];
		this.opts = opts;
		if(!opts||!opts.progress){ this.opts.progress = function(img,index,status,progress,all){ /* alert(progress+'/'+all); */ }; };
		if(!opts||!opts.complete){ this.opts.complete = function(){ /* alert('completed!('+index+')'); */ }; };
		function defaultLoadedHandle(status){
			progressCount ++;
			this.queue.opts.progress( this , this.index , status , progressCount , this.queue.targets.length );
			if( progressCount == this.queue.targets.length ){
				this.queue.opts.complete();
			}
		}

		if(typeof(targets)==typeof('')){
			//文字列だったら、HTMLソースを受け取ったと解釈。
			var elm = $(targets);
			var elmImages = $('img',elm);
			this.targets = [];
			for( var i = 0; i < elmImages.size(); i ++ ){
				this.targets.push( elmImages[i].src );
			}
		}else if(typeof(targets)==typeof([])){
			//オブジェクト型だったら、画像のパスの配列を受け取ったと解釈。
			this.targets = targets;
		}

		this.getIndex = function(){ return index; }
		this.setIndex = function(num){ index = num; return true; }

		this.setIndex( addQueue(this) );

		if( this.targets.length ){
			//画像の読み込みを開始する
			for( var i = 0; i < this.targets.length; i ++ ){
				caches[this.targets[i]] = new Image();
				caches[this.targets[i]].queue = this;
				caches[this.targets[i]].index = i;
				caches[this.targets[i]].onload  = function(){ this.defaultLoadedHandle('load'); };
				caches[this.targets[i]].onabort = function(){ this.defaultLoadedHandle('abort'); };
				caches[this.targets[i]].onerror = function(){ this.defaultLoadedHandle('error'); };
				caches[this.targets[i]].defaultLoadedHandle = defaultLoadedHandle;
				caches[this.targets[i]].src = this.targets[i];
			}
		}else{
			//画像のリストが空っぽだった場合、いきなり complete();
			this.opts.complete();
		}

		return this;
	}//classQueueTemplate();

	/*
	* pxImageLoad();
	*/
	$.pxImageLoad = function(targets,opts){
		var currentQueue = new classQueueTemplate(targets,opts);
	}// pxImageLoad();


	/*
	* pxImageClearCaches();
	*/
	$.pxImageClearCaches = function(){
		queue = [];
	}// pxImageClearCaches();

	function addQueue( Q ){
		queue.push(Q);
		return (queue.length-1);
	}

	function getQueue( index ){
		return queue[index];
	}


})(jQuery);