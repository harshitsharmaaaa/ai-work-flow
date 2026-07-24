import toposort from "toposort";
import type { WorkFlowGraph } from "../../../lib/db/schema";


export function validateGraph({nodes, edges}: WorkFlowGraph):string[] {
    const problems: string[] = [];
    const triggers = nodes.filter(node => node.data.kind === "trigger");
    if(triggers.length !== 1) {
        problems.push("A workflow must have exactly one trigger node.");
    }

    if( edges.length === 0) {
        problems.push("A workflow must have at least one edge.");
    }
    else{
        try{
            toposort(edges.map((e)=>[e.source, e.target]))
        }
        catch{
            problems.push("The workflow is not acyclic.");
        }
    }

    return problems;
}