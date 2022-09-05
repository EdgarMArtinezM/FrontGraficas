import { Component, ElementRef,OnInit, ViewChild } from '@angular/core';
import { SocketService } from './socket.service';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild("canvas", { static: true }) canvas!: ElementRef;
  @ViewChild("canvasDos", { static: true }) canvasDos!: ElementRef;
  hum:any;
  temp:any;
  fecha:any;
  chart!: Chart;
  chartDos!: Chart;
  gradient: any;
  array: any=[];
  arrayHum:any=[];
  arrayDate: any=[];
  constructor(socket:SocketService){
    Chart.register(...registerables);
    socket.socket.on("iot/sensors",(dta:any)=>{
      this.fecha = new DatePipe("en-US").transform(new Date().getTime(),'short');
      this.arrayDate.push(this.fecha);
      if (dta.sensor == 'TEMP') {
        this.temp = Math.trunc(dta.value);
        this.array.push(Math.trunc(dta.value))
      }else{
        this.hum = Math.trunc(dta.value);
        this.arrayHum.push(Math.trunc(dta.value))
      }
      this.updateChart();
      this.updateChartDos();
    })
  }
  ngOnInit(){
    this.updateChart();
    this.updateChartDos();
  }
  initChart(){
    this.gradient = this.canvas.nativeElement.getContext("2d").createLinearGradient(0, 0, 0, 200);
    this.gradient.addColorStop(0, "#81818166");
    this.gradient.addColorStop(1,"#FFFFFF80");
    this.chart = new Chart(this.canvas.nativeElement, {
      type: "line",
      data: {
          labels: [],
          datasets: []
      }
    });
  }
  initChartDos(){
    this.gradient = this.canvasDos.nativeElement.getContext("2d").createLinearGradient(0, 0, 0, 200);
    this.gradient.addColorStop(0, "#81818166");
    this.gradient.addColorStop(1,"#FFFFFF80");
    this.chartDos = new Chart(this.canvasDos.nativeElement, {
      type: "line",
      data: {
          labels: [],
          datasets: []
      }
    });
  }
  setLabels(){
    this.chart.data.labels = this.arrayDate;
  }
  setLabelsDos(){
    this.chartDos.data.labels = this.arrayDate;
  }
  setDatasets(){
    this.chart.data.datasets = [{
       label: "Temperatura",
       data: this.array,
       backgroundColor: ['rgba(255, 99, 132, 0.2)'],
       borderColor: ['rgba(255, 99, 132, 1)'],
       borderWidth: 1
     }]
   }
   setDatasetsDos(){
    this.chartDos.data.datasets = [{
       label: "Humedad",
       data: this.arrayHum,
       backgroundColor: ['rgba(255, 99, 132, 0.2)'],
       borderColor: ['rgba(255, 99, 132, 1)'],
       borderWidth: 1
     }]
   }
   updateChart(){
    let chartCan = this.canvas.nativeElement;
    if(chartCan){
      if(!this.chart) this.initChart();
      this.setLabels();
      this.setDatasets();
      this.chart.update();
    } 
  }
  updateChartDos(){
    let chartCan = this.canvasDos.nativeElement;
    if(chartCan){
      if(!this.chartDos) this.initChartDos();
      this.setLabelsDos();
      this.setDatasetsDos();
      this.chartDos.update();
    } 
  }
}
