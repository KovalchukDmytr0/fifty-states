import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Feature } from 'geojson';

interface D3StateMapProps {
  onStateSelect: (state: string) => void;
}

export const D3StateMap: React.FC<D3StateMapProps> = ({ onStateSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;

    // Set up the projection
    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load US states data
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then((us: any) => {
        const states = topojson.feature(us, us.objects.states);

        // Draw states
        svg.selectAll('path')
          .data(states.features)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('class', 'state')
          .attr('fill', '#ddd')
          .attr('stroke', '#fff')
          .attr('stroke-width', '1')
          .on('mouseover', function(event, d: any) {
            d3.select(this)
              .attr('fill', '#aaa');
          })
          .on('mouseout', function(event, d: any) {
            d3.select(this)
              .attr('fill', '#ddd');
          })
          .on('click', function(event, d: any) {
            onStateSelect(d.properties.name);
          });
      });
  }, [onStateSelect]);

  return (
    <div className="w-full overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 800 500"
        className="w-full h-auto"
      />
    </div>
  );
}; 