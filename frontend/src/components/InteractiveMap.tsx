import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { Feature } from 'geojson'

interface InteractiveMapProps {
  onStateSelect: (state: string) => void
}

const InteractiveMap = ({ onStateSelect }: InteractiveMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 800
    const height = 500

    // Clear any existing content
    svg.selectAll("*").remove()

    // Set up projection
    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // Load US states data
    d3.json<any>("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((us) => {
        const states = svg.append("g")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("class", "state")
          .attr("fill", "#e5e7eb")
          .attr("stroke", "#fff")
          .attr("stroke-width", "0.5")
          .style("cursor", "pointer")
          .on("mouseover", function() {
            d3.select(this)
              .attr("fill", "#9ca3af")
          })
          .on("mouseout", function() {
            d3.select(this)
              .attr("fill", "#e5e7eb")
          })
          .on("click", (event, d: any) => {
            const state = d.properties.name
            onStateSelect(state)
          })
      })
  }, [onStateSelect])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 500"
      className="w-full h-auto"
    />
  )
}

export default InteractiveMap 