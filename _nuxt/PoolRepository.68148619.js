import{Q as S,ak as Q,al as I,I as c,M as d,S as j,aF as E,H as k,J as V,R as K,T as J,O as W,aG as Y,aH as X,aI as Z,g as ee,aC as C,l as ne,i as f,az as v,o as ae,c as te,b as B,w as ie,a as b,k as T,s as le,aJ as oe,aK as se,aL as de,aM as U,aE as $,a3 as re}from"./entry.45f7bb82.js";import{n as ue,g as ce,P as w,a as z}from"./Pool.1d2bcc36.js";import{B as me}from"./taquito.es6.33a9b417.js";const qe=S({name:"QAvatar",props:{...Q,fontSize:String,color:String,textColor:String,icon:String,square:Boolean,rounded:Boolean},setup(e,{slots:n}){const a=I(e),i=c(()=>"q-avatar"+(e.color?` bg-${e.color}`:"")+(e.textColor?` text-${e.textColor} q-chip--colored`:"")+(e.square===!0?" q-avatar--square":e.rounded===!0?" rounded-borders":"")),t=c(()=>e.fontSize?{fontSize:e.fontSize}:null);return()=>{const l=e.icon!==void 0?[d(j,{name:e.icon})]:void 0;return d("div",{class:i.value,style:a.value},[d("div",{class:"q-avatar__content row flex-center overflow-hidden",style:t.value},E(n.default,l))])}}}),_e={ratio:[String,Number]};function ke(e,n){return c(()=>{const a=Number(e.ratio||(n!==void 0?n.value:void 0));return isNaN(a)!==!0&&a>0?{paddingBottom:`${100/a}%`}:null})}const ve=16/9,Ce=S({name:"QImg",props:{..._e,src:String,srcset:String,sizes:String,alt:String,crossorigin:String,decoding:String,referrerpolicy:String,draggable:Boolean,loading:{type:String,default:"lazy"},fetchpriority:{type:String,default:"auto"},width:String,height:String,initialRatio:{type:[Number,String],default:ve},placeholderSrc:String,fit:{type:String,default:"cover"},position:{type:String,default:"50% 50%"},imgClass:String,imgStyle:Object,noSpinner:Boolean,noNativeMenu:Boolean,noTransition:Boolean,spinnerColor:String,spinnerSize:String},emits:["load","error"],setup(e,{slots:n,emit:a}){const i=k(e.initialRatio),t=ke(e,i);let l=null,r=!1;const s=[k(null),k(y())],u=k(0),_=k(!1),m=k(!1),h=c(()=>`q-img q-img--${e.noNativeMenu===!0?"no-":""}menu`),D=c(()=>({width:e.width,height:e.height})),L=c(()=>`q-img__image ${e.imgClass!==void 0?e.imgClass+" ":""}q-img__image--with${e.noTransition===!0?"out":""}-transition`),M=c(()=>({...e.imgStyle,objectFit:e.fit,objectPosition:e.position}));V(()=>N(),F);function N(){return e.src||e.srcset||e.sizes?{src:e.src,srcset:e.srcset,sizes:e.sizes}:null}function y(){return e.placeholderSrc!==void 0?{src:e.placeholderSrc}:null}function F(o){l!==null&&(clearTimeout(l),l=null),m.value=!1,o===null?(_.value=!1,s[u.value^1].value=y()):_.value=!0,s[u.value].value=o}function A({target:o}){r!==!0&&(l!==null&&(clearTimeout(l),l=null),i.value=o.naturalHeight===0?.5:o.naturalWidth/o.naturalHeight,x(o,1))}function x(o,p){r===!0||p===1e3||(o.complete===!0?G(o):l=setTimeout(()=>{l=null,x(o,p+1)},50))}function G(o){r!==!0&&(u.value=u.value^1,s[u.value].value=null,_.value=!1,m.value=!1,a("load",o.currentSrc||o.src))}function H(o){l!==null&&(clearTimeout(l),l=null),_.value=!1,m.value=!0,s[u.value].value=null,s[u.value^1].value=y(),a("error",o)}function q(o){const p=s[o].value,g={key:"img_"+o,class:L.value,style:M.value,crossorigin:e.crossorigin,decoding:e.decoding,referrerpolicy:e.referrerpolicy,height:e.height,width:e.width,loading:e.loading,fetchpriority:e.fetchpriority,"aria-hidden":"true",draggable:e.draggable,...p};return u.value===o?(g.class+=" q-img__image--waiting",Object.assign(g,{onLoad:A,onError:H})):g.class+=" q-img__image--loaded",d("div",{class:"q-img__container absolute-full",key:"img"+o},d("img",g))}function O(){return _.value!==!0?d("div",{key:"content",class:"q-img__content absolute-full q-anchor--skip"},W(n[m.value===!0?"error":"default"])):d("div",{key:"loading",class:"q-img__loading absolute-full flex flex-center"},n.loading!==void 0?n.loading():e.noSpinner===!0?void 0:[d(Y,{color:e.spinnerColor,size:e.spinnerSize})])}return F(N()),K(()=>{r=!0,l!==null&&(clearTimeout(l),l=null)}),()=>{const o=[];return t.value!==null&&o.push(d("div",{key:"filler",style:t.value})),m.value!==!0&&(s[0].value!==null&&o.push(q(0)),s[1].value!==null&&o.push(q(1))),o.push(d(J,{name:"q-transition--fade"},O)),d("div",{class:h.value,style:D.value,role:"img","aria-label":e.alt},o)}}}),pe=[d("g",[d("path",{fill:"none",stroke:"currentColor","stroke-width":"5","stroke-miterlimit":"10",d:"M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"}),d("clipPath",{id:"uil-hourglass-clip1"},[d("rect",{x:"15",y:"20",width:" 70",height:"25"},[d("animate",{attributeName:"height",from:"25",to:"0",dur:"1s",repeatCount:"indefinite",values:"25;0;0",keyTimes:"0;0.5;1"}),d("animate",{attributeName:"y",from:"20",to:"45",dur:"1s",repeatCount:"indefinite",values:"20;45;45",keyTimes:"0;0.5;1"})])]),d("clipPath",{id:"uil-hourglass-clip2"},[d("rect",{x:"15",y:"55",width:" 70",height:"25"},[d("animate",{attributeName:"height",from:"0",to:"25",dur:"1s",repeatCount:"indefinite",values:"0;25;25",keyTimes:"0;0.5;1"}),d("animate",{attributeName:"y",from:"80",to:"55",dur:"1s",repeatCount:"indefinite",values:"80;55;55",keyTimes:"0;0.5;1"})])]),d("path",{d:"M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z","clip-path":"url(#uil-hourglass-clip1)",fill:"currentColor"}),d("path",{d:"M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z","clip-path":"url(#uil-hourglass-clip2)",fill:"currentColor"}),d("animateTransform",{attributeName:"transform",type:"rotate",from:"0 50 50",to:"180 50 50",repeatCount:"indefinite",dur:"1s",values:"0 50 50;0 50 50;180 50 50",keyTimes:"0;0.7;1"})])],Be=S({name:"QSpinnerHourglass",props:X,setup(e){const{cSize:n,classes:a}=Z(e);return()=>d("svg",{class:a.value,width:n.value,height:n.value,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid",xmlns:"http://www.w3.org/2000/svg"},pe)}}),ge={class:"bg-black text-white no-wrap p-4"},fe={class:"col"},he=b("div",{class:"text-h7 font-bold q-mb-md"},"Slippage Tolerance",-1),Te=ee({__name:"SetSlippage",async setup(e){let n,a;const i=([n,a]=C(()=>ne().getDAppClient()),n=await n,a(),n),t=([n,a]=C(()=>i.getActiveAccount()),n=await n,a(),n),l=f(v).find(t.address);console.log(t),l||f(v).save({id:t.address,walletKey:t.walletKey,lastConnected:t.connectedAt,slippage:"0.5"});const r=c(()=>f(v).find(t.address).slippage),s=u=>{u&&f(v).save({id:t?.address,slippage:u})};return(u,_)=>{const m=le,h=oe;return ae(),te("div",null,[B(h,{dark:"",outline:"",dense:"","dropdown-icon":"none",icon:"tune",class:"tx-settings",color:"orange",label:`${T(r)}%`},{default:ie(()=>[b("div",ge,[b("div",fe,[he,B(m,{dark:"",outlined:"",autofocus:"","model-value":T(r),color:"orange",suffix:"%",mask:"#.##","input-class":"focus:ring-0 focus:ring-offset-0","onUpdate:modelValue":s},null,8,["model-value"])])])]),_:1},8,["label"])])}}});const P={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"GetPool"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"indexer_pool"},arguments:[{kind:"Argument",name:{kind:"Name",value:"order_by"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"total_liquidity"},value:{kind:"EnumValue",value:"desc"}}]}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"holders_count"}},{kind:"Field",name:{kind:"Name",value:"swaps_count"}},{kind:"Field",name:{kind:"Name",value:"swap_enabled"}},{kind:"Field",name:{kind:"Name",value:"address"}},{kind:"Field",name:{kind:"Name",value:"index"}},{kind:"Field",name:{kind:"Name",value:"factory"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"owner"}},{kind:"Field",name:{kind:"Name",value:"create_time"}},{kind:"Field",name:{kind:"Name",value:"swap_fee"}},{kind:"Field",name:{kind:"Name",value:"total_liquidity"}},{kind:"Field",name:{kind:"Name",value:"total_shares"}},{kind:"Field",name:{kind:"Name",value:"total_swap_fee"}},{kind:"Field",name:{kind:"Name",value:"total_swap_volume"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"pool_type"}},{kind:"Field",name:{kind:"Name",value:"symbol"}},{kind:"Field",name:{kind:"Name",value:"tokens_list"}},{kind:"Field",name:{kind:"Name",value:"pool_tokens"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"address"}},{kind:"Field",name:{kind:"Name",value:"balance"}},{kind:"Field",name:{kind:"Name",value:"index"}},{kind:"Field",name:{kind:"Name",value:"decimals"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"symbol"}},{kind:"Field",name:{kind:"Name",value:"token_id"}},{kind:"Field",name:{kind:"Name",value:"weight"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"pool_id"}},{kind:"Field",name:{kind:"Name",value:"pool_token_id"}},{kind:"Field",name:{kind:"Name",value:"token"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fa2"}}]}}]}}]}}]}}]},ye={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"GetToken"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"indexer_token"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"total_swap_count"}},{kind:"Field",name:{kind:"Name",value:"fa2"}},{kind:"Field",name:{kind:"Name",value:"address"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"latest_price_id"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"pool_id"}},{kind:"Field",name:{kind:"Name",value:"symbol"}},{kind:"Field",name:{kind:"Name",value:"decimals"}},{kind:"Field",name:{kind:"Name",value:"latest_usd_price"}},{kind:"Field",name:{kind:"Name",value:"latest_usd_price_timestamp"}},{kind:"Field",name:{kind:"Name",value:"token_id"}},{kind:"Field",name:{kind:"Name",value:"total_balance_notional"}},{kind:"Field",name:{kind:"Name",value:"total_balance_usd"}},{kind:"Field",name:{kind:"Name",value:"total_volume_notional"}},{kind:"Field",name:{kind:"Name",value:"total_volume_usd"}}]}}]}}]},we={"\n  query GetPool {\n    indexer_pool(order_by: { total_liquidity: desc }) {\n      holders_count\n      swaps_count\n      swap_enabled\n      address\n      index\n      factory\n      id\n      owner\n      create_time\n      swap_fee\n      total_liquidity\n      total_shares\n      total_swap_fee\n      total_swap_volume\n      name\n      pool_type\n      symbol\n      tokens_list\n      pool_tokens {\n        address\n        balance\n        index\n        decimals\n        name\n        symbol\n        token_id\n        weight\n        id\n        pool_id\n        pool_token_id\n        token {\n          fa2\n        }\n      }\n    }\n  }\n":P,"\n      query GetPool {\n        indexer_pool(order_by: { total_liquidity: desc }) {\n          holders_count\n          swaps_count\n          swap_enabled\n          address\n          index\n          factory\n          id\n          owner\n          create_time\n          swap_fee\n          total_liquidity\n          total_shares\n          total_swap_fee\n          total_swap_volume\n          name\n          pool_type\n          symbol\n          tokens_list\n          pool_tokens {\n            address\n            balance\n            index\n            decimals\n            name\n            symbol\n            token_id\n            weight\n            id\n            pool_id\n            pool_token_id\n            token {\n              fa2\n            }\n          }\n        }\n      }\n    ":P,"\n      query GetToken {\n        indexer_token {\n          total_swap_count\n          fa2\n          address\n          id\n          latest_price_id\n          name\n          pool_id\n          symbol\n          decimals\n          latest_usd_price\n          latest_usd_price_timestamp\n          token_id\n          total_balance_notional\n          total_balance_usd\n          total_volume_notional\n          total_volume_usd\n        }\n      }\n    ":ye};function R(e){return we[e]??{}}class be extends se{static entity="tokens";static fields(){return{id:this.attr(null),total_swap_count:this.number(0),fa2:this.boolean(!0),address:this.string(""),name:this.string(""),symbol:this.string(""),decimals:this.number(18),token_id:this.number(0),total_balance_notional:this.number(0),total_balance_usd:this.number(0),total_volume_notional:this.number(0),total_volume_usd:this.number(0),userBalance:this.string("0"),icon:this.string(null)}}static piniaOptions={persist:de.localStorage};normalizedBalance(){return me(this.userBalance).dividedBy(10**this.decimals).toString()}formatBalance(){return ue(this.normalizedBalance()).format({average:!0,totalLength:6})}}class Se extends U{use=be;async fetch(){const n=R(`
      query GetToken {
        indexer_token {
          total_swap_count
          fa2
          address
          id
          latest_price_id
          name
          pool_id
          symbol
          decimals
          latest_usd_price
          latest_usd_price_timestamp
          token_id
          total_balance_notional
          total_balance_usd
          total_volume_notional
          total_volume_usd
        }
      }
    `),{pending:a,data:i,error:t}=await $(n);if(i.value&&i.value.indexer_token){const l=i.value.indexer_token.map(r=>({id:r.id,total_swap_count:r.total_swap_count,fa2:r.fa2,address:r.address,name:r.name,symbol:r.symbol,decimals:r.decimals,token_id:r.token_id,total_balance_notional:r.total_balance_notional,total_balance_usd:r.total_balance_usd,total_volume_notional:r.total_volume_notional,total_volume_usd:r.total_volume_usd,icon:`icons/${r.symbol?.toUpperCase()}.png`}));this.save(l)}console.log(i.value)}async fetchUserBalances(n){const a=this.where("token_id",t=>!isNaN(Number(t))).get(),i=await ce(a,n);this.save(i.balances)}}class ze extends U{use=w;store(n){const a=[],i=n.indexer_pool.map(t=>{const l={id:t.id,swaps_count:t.swaps_count,address:t.address,poolId:t.index,factory:t.factory,owner:t.owner,create_time:t.create_time,name:t.name,symbol:t.symbol,pool_type:t.pool_type,swap_fee:t.swap_fee,tokens_list:t.tokens_list,total_swap_volume:t.total_swap_volume,total_swap_fee:t.total_swap_fee,total_liquidity:t.total_liquidity},r=t.pool_tokens.map(s=>({id:s.id,address:s.address,balance:s.balance,index:s.index,name:s.name,symbol:s.symbol,decimals:s.decimals,token_id:s.token_id,weight:s.weight,pool_id:s.pool_id,pool_token_id:s.pool_token_id,FA2:s.token?s.token.fa2:!1,icon:`icons/${s.symbol?.toUpperCase()}.png`}));return a.push(...r),l});this.save(i),this.repo(z).save(a)}getPoolList(){return this.repo(w).has("pool_tokens",2).with("pool_tokens").where("factory",re.contracts.factory).get().map(a=>({composition:a.pool_tokens.map(i=>({symbol:i.symbol,weight:`${i.weight/(10*10**15)}%`})),total_liquidity:a.totalLiquidity(),total_swap_volume:a.total_swap_volume,address:a.address,icons:a.pool_tokens.map(i=>i.icon)}))}tvl(){let n=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});const i=this.repo(w).has("pool_tokens",2).with("pool_tokens").get().reduce((t,l)=>t+l.totalLiquidity(),0);return n.format(i)}async fetchPoolData(){const n=R(`
      query GetPool {
        indexer_pool(order_by: { total_liquidity: desc }) {
          holders_count
          swaps_count
          swap_enabled
          address
          index
          factory
          id
          owner
          create_time
          swap_fee
          total_liquidity
          total_shares
          total_swap_fee
          total_swap_volume
          name
          pool_type
          symbol
          tokens_list
          pool_tokens {
            address
            balance
            index
            decimals
            name
            symbol
            token_id
            weight
            id
            pool_id
            pool_token_id
            token {
              fa2
            }
          }
        }
      }
    `),{pending:a,data:i,error:t}=await $(n);i.value&&i.value.indexer_pool&&this.store(i.value);const l=this.repo(v).where("active",!0).first();l&&await this.repo(Se).fetchUserBalances(l.id)}async updateUserBalances(n,a){const i=await n.getUserBalances(a);this.repo(z).save(i)}async updateUserLPBalance(n,a){const i=await n.getUserLPBalance(a);this.save({id:n.id,userLPBalance:i})}async updatePoolShares(n){const a=await n.getPoolShares();this.save({id:n.id,pool_shares:a})}}export{ze as P,Se as T,Ce as _,qe as a,Be as b,Te as c,be as d,R as g};
