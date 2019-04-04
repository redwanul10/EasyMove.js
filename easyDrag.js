
	// DRAG and DROP...............
	
	(function(){
	
	// default opions.....
	var defaults = {
	dropAnimation : true,
	animationClass : "fadein",
	cloneOpacity :0.8,
	transition:"0.4s",
	};
	
	var dragAndDrop = function(element,option = {}){
	
		this.start = false;
		this.LastElement = null;
		this.FirstElement = null;
		this.clone = null;
		this.moveX =0;
		this.movey =0;
		this.isMoving = false;
		this.element = element;
		var $thiss = this;
		var option;	
		
		// dragStart Function for Mousedown and Touchstart
		this.dragStart = function(event){
		
			// Get mouse position on mouse down
			this.mouseX = event.pageX || event.touches[0].pageX;
			this.mouseY = event.pageY || event.touches[0].pageY;
			
			this.isMoving = true;
			this.start = true;
			
			// Get FirstElement on mousedown
			this.FirstElement = event.target;
			
			// If FirstElement dont have "box" class
			// Find the parent which have "box" class
			// else return false
			if(!this.FirstElement.classList.contains("box")){
				this.FirstElement = this.findParent(event.target,"box");
				
				if(!this.FirstElement){
					this.isMoving = false;
					return false;
				}
				
			}
			
			// Remove animation class
			if(option.dropAnimation){
			
				var fadein = document.querySelectorAll("."+ option.animationClass);
				fadein.forEach(function(item){
					item.classList.remove(option.animationClass);
				});
				
			}	
			
			// Create FirstElement clone for draging
			this.clonePosotioning(this.FirstElement);
			
			// Add dragMove Function on Mosuedown and Touchmove....
			window.addEventListener("mousemove",this.dragMove.bind(this));
			
			window.addEventListener("touchmove",this.dragMove.bind(this));
				
				
		};
		
		// dragMove Function for Mousemove and Touchmove
		
		this.dragMove = function(event){ 
		
			
			// If isMoving is true hide FirstElement
			// And change the FirstElement clone position
			if(this.isMoving){
			
				// Get Touch and Mouse position on mouse move
				if( event.type == "mousemove"){
					this.moveX = event.pageX;
					this.movey = event.pageY;
				}else{
					this.moveX = event.touches[0].pageX;
					this.movey = event.touches[0].pageY;
				}
			
				this.FirstElement.style.opacity = "0";
				this.clone.style.left = this.moveX - (this.mouseX -this.FirstElement.offsetLeft)+"px";
				this.clone.style.top =  this.movey - (this.mouseY -this.FirstElement.offsetTop)+"px";
				
			}
			
		};
		
		// drop Function for Mouseup and Touchend
		this.drop = function(event){
			
			// Return noting if FirstElement is null
			if(!this.FirstElement){
				return ;
			}
			// Delete clone element
			this.clone.parentNode.removeChild(this.clone);
			
			// Display FirstElement
			this.FirstElement.style.opacity = "1";
			this.isMoving = false;
			
			// Get element from Mouse point or Touch point
			var element = document.elementFromPoint(this.moveX,this.movey);
			
			// replace element
			this.checkAndReplace(element);
			
		};
		
		
		// checkAndReplace Function replace element
		
		this.checkAndReplace = function mouseover(element){
		
			
		
			if(this.start && !this.isMoving){
			
				// Get FirstElement on mouseover
				this.LastElement = element;
				
				// If LastElement dont have "box" class
				// Find the parent which have "box" class
				if(!this.LastElement.classList.contains("box")){
					this.LastElement = this.findParent(this.LastElement,"box");
				}
				
				// Return nothing if FirstElement and LastElement same
				// Or drop on onother section
				// Or LastElement is null
				
				if(!this.LastElement || this.FirstElement == this.LastElement ||
					this.FirstElement.parentNode != this.LastElement.parentNode){
					
					this.start        = false;
					this.FirstElement = null;
					return ;
				}
					
					 //create FirstElement and LastElement Clone
				var	clone1 = this.FirstElement.cloneNode(true);
				var	clone2 = this.LastElement.cloneNode(true);
					
					 // replace with clone elements
					this.element.replaceChild(clone1,this.LastElement);
					this.element.replaceChild(clone2,this.FirstElement);
					
					 // add fadein class for animation after replace
					if( option.dropAnimation ){ 
						clone1.classList.add(option.animationClass);
						clone2.classList.add(option.animationClass);
					}	
					// reset all the value
					this.start = false;
					this.LastElement = null;
					this.FirstElement = null;
					
				
			}
			
		};
		
		// Find parent with class
		this.findParent = function(item,className){
			if(item == document.body){return false;}
			var parent = item.parentNode;
			if(parent.className.split(" ").indexOf(className) < 0){
				this.findParent(parent,className);
			}else{
				return parent;
			}
		};
		
		
		
		
		// Create clone and position over the 
		// given element
		this.clonePosotioning = function(cloneElem){
		
			this.clone = cloneElem.cloneNode(true);
			var clone = this.clone;
			var divX = cloneElem.offsetLeft;
			var divY = cloneElem.offsetTop;
			clone.setAttribute("id","clone");
			clone.style.left 		= divX+"px";
			clone.style.top 		= divY+"px";
			clone.style.position  	= "absolute";
			clone.style.margin  	= 0+"px";
			clone.style.opacity  = option.cloneOpacity;
			
			
			this.element.appendChild(clone);
			
		};
		
		
		this.extendObject = function(user,defaults){
			for( name in defaults){
				if(user[name] == null){
					user[name] = defaults[name];
				}
			}
			return user;
		};
		

		
		this.init = function(){
		
			option = this.extendObject(option,defaults);
			
			if(option.transition){
				var child = this.element.children;
				for(var i = 0; i < child.length; i++){
				child[i].style.transition = "opacity "+option.transition;
				}
			}
			// Add function for desktop
			this.element.addEventListener("mousedown",this.dragStart.bind(this));
			this.element.addEventListener("mouseup",this.drop.bind(this));
			
			// Add function for mobile
			this.element.addEventListener("touchstart",this.dragStart.bind(this));
			this.element.addEventListener("touchend",this.drop.bind(this));
		};
		
	
	}
	
		window.dragAndDrop = dragAndDrop;
	
	})();
    
	var parent = document.querySelector(".parent");
	
	var drop = new dragAndDrop(parent).init();
	
	