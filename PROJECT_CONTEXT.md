# F-Avoiding Orientations Website — Project Context

## Purpose

This project is a free, public website about F-avoiding orientations of regular graphs.

The website has two main roles:

1. **Interactive Playground**  
   Allow a user to explore proofs of d-regular F-avoiding orientation problems by applying mathematical tools step by step and seeing how the current structural and outdegree information changes.

2. **Proof Warehouse**  
   Store concise proofs for the known d-regular cases, together with links to reusable lemmas, theorems, orientation methods, and repair tools.

## Core Vision

A user chooses a degree d and a forbidden set F.

The playground represents an arbitrary d-regular graph symbolically rather than drawing one particular graph. The main visual object may be a pleasing blob representing the graph or a collection of blobs representing parts of a partition.

The user can apply tools such as:

- Lovasz partitions
- orientations across a partition
- balanced orientations
- Ma-Lu orientations
- Hasanvand-type orientations
- 2-factor constructions
- directed-Menger repairs
- other tools developed in the orientations project

As tools are applied, the website should visually update the mathematical state, including information about possible outdegrees and which forbidden values remain problematic.

A known proof should ultimately be representable as a sequence of these reusable tools.

## Important Design Principles

- The core website must be free to build, free to host, and free for users to access.
- Mathematics, proof data, and visual presentation should be kept separate whenever possible.
- Approved visual components should not be changed unless the requested task requires changing them.
- Small changes should not cause unrelated redesigns.
- Experimental visual work should be isolated from approved components.
- The website should be easy to expand as new cases and new proofs are discovered.
- The first prototype will use only one 12-regular case.
- We are not initially building automated proof search, a database, user accounts, or a backend.
- We are not initially working with a specific concrete graph. The playground represents universal proof information symbolically.

## Current Stage

The GitHub repository has been created and published.

Current goal: organize the project carefully before writing the first website code.

The next major milestone will be a one-case prototype for the 12-regular problem.