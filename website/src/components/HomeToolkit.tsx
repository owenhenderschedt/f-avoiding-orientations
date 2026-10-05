import { useState } from 'react'
import Math from './Math'
import ToolReferencePanel from './ToolReferencePanel'
import ParityBoundsReference from '../tools/parityBounds'
import { DirectedMengerReservoirReference } from '../tools/directedMengerReservoir'

type HomeToolId =
  | 'lovasz'
  | 'orient-across'
  | 'balanced'
  | 'avoid-c'
  | 'ma-lu'
  | 'hasanvand'
  | 'parity'
  | 'two-factor'
  | 'stabilize'
  | 'menger-local'
  | 'menger-reservoir'

type ToolEntry = {
  id: HomeToolId
  name: string
  description: string
}

const toolGroups: readonly {
  label: string
  tools: readonly ToolEntry[]
}[] = [
  {
    label: 'Constructors',
    tools: [
      {
        id: 'lovasz',
        name: 'Lovász Partition',
        description:
          'Partition the working graph into two bounded-degree pieces, with the strengthened extremal certificate used later by reservoir Menger.',
      },
      {
        id: 'orient-across',
        name: 'Orient Across Partition',
        description:
          'Orient every edge between the Lovász parts in one direction and convert the internal degree bounds into total-outdegree ranges.',
      },
      {
        id: 'balanced',
        name: 'Balanced Orientation',
        description:
          'Orient a graph so every outdegree is one of the two integers nearest half its degree.',
      },
      {
        id: 'avoid-c',
        name: 'Avoid c',
        description:
          'Avoid one prescribed outdegree c > 1 at every vertex of an arbitrary finite graph.',
      },
      {
        id: 'ma-lu',
        name: 'Ma–Lu',
        description:
          'Avoid a nonconsecutive forbidden list satisfying the local half-degree bound.',
      },
      {
        id: 'hasanvand',
        name: 'Hasanvand Compression',
        description:
          'Compress an allowable outdegree interval to four endpoint values.',
      },
      {
        id: 'parity',
        name: 'Parity Bounds',
        description:
          'Combine prescribed outdegree parity with lower and upper bounds in the regular-graph form used by the project.',
      },
    ],
  },
  {
    label: 'Reductions',
    tools: [
      {
        id: 'two-factor',
        name: 'Oriented 2-Factor',
        description:
          'Remove a directed spanning 2-factor, lowering the regular degree by two and adding one fixed outgoing edge at every vertex.',
      },
    ],
  },
  {
    label: 'Fixers',
    tools: [
      {
        id: 'stabilize',
        name: 'Stabilize Outdegree Classes',
        description:
          'Use arc reversals to make a nonconsecutive collection of outdegree classes independent.',
      },
      {
        id: 'menger-local',
        name: 'Directed Menger Repair',
        description:
          'Repair bad outdegrees by reversing a capacitated family of pairwise arc-disjoint directed paths.',
      },
      {
        id: 'menger-reservoir',
        name: 'Directed Menger — Reservoir',
        description:
          'Use the strengthened Lovász side as a reservoir that certifies the Menger cut inequalities automatically.',
      },
    ],
  },
]

function Formula({
  children,
}: {
  children: string
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        margin: '18px 0',
        padding: '10px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        background: '#f8fafc',
        overflowX: 'auto',
      }}
    >
      <Math display>{children}</Math>
    </div>
  )
}

function ReferenceLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        color: '#475569',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
      }}
    >
      {children}
    </a>
  )
}

function LovaszReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Theorem (Lovász)</h3>
        <p>
          Let <Math>{'H'}</Math> be a finite graph and let{' '}
          <Math>{'s,t\\geq0'}</Math> be integers satisfying
        </p>
        <Formula>{'s+t\\geq\\Delta(H)-1.'}</Formula>
        <p>
          Then <Math>{'V(H)'}</Math> can be partitioned as{' '}
          <Math>{'V(H)=L\\cup R'}</Math> so that
        </p>
        <Formula>
          {'\\Delta(H[L])\\leq s,\\qquad\\Delta(H[R])\\leq t.'}
        </Formula>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Strengthened choice used in this project</h3>
        <p>
          When the working graph is <Math>{'d'}</Math>-regular, the
          playground uses a tight pair <Math>{'s+t=d-1'}</Math>. Among
          all partitions, it chooses one minimizing
        </p>
        <Formula>
          {'\\Phi(L,R)=t\\,e_H(L)+(s+1)e_H(R),'}
        </Formula>
        <p>
          and, subject to this, maximizing <Math>{'|R|'}</Math>. Besides
          the usual Lovász bounds, this gives the reservoir certificate
          used by Directed Menger — Reservoir.
        </p>
        <p>
          If <Math>{'P\\subseteq L'}</Math> is independent and{' '}
          <Math>{'S\\subseteq R'}</Math>, define
        </p>
        <Formula>
          {'Q_P(S)=\\{p\\in P:N_H(p)\\cap R\\subseteq S\\}.'}
        </Formula>
        <p>Then the extremal partition satisfies</p>
        <Formula>
          {'e_{H[R]}(S)+e_H(S,R\\setminus S)+t|Q_P(S)|\\leq t|S|.'}
        </Formula>
      </section>
    </>
  )
}

function OrientAcrossReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Bookkeeping rule</h3>
        <p>
          Suppose <Math>{'H'}</Math> is <Math>{'d'}</Math>-regular and
          a Lovász partition satisfies
        </p>
        <Formula>
          {'\\Delta(H[L])\\leq s,\\qquad\\Delta(H[R])\\leq t.'}
        </Formula>
        <p>
          If every cut edge is oriented from <Math>{'L'}</Math> to{' '}
          <Math>{'R'}</Math>, then
        </p>
        <Formula>
          {'d_D^+(v)\\in\\{d-s,\\ldots,d\\}\\ (v\\in L),\\qquad d_D^+(v)\\in\\{0,\\ldots,t\\}\\ (v\\in R).'}
        </Formula>
        <p>
          Reversing all cut edges gives the symmetric bounds
        </p>
        <Formula>
          {'d_D^+(v)\\in\\{0,\\ldots,s\\}\\ (v\\in L),\\qquad d_D^+(v)\\in\\{d-t,\\ldots,d\\}\\ (v\\in R).'}
        </Formula>
      </section>
      <section>
        <h3>Role in the toolkit</h3>
        <p style={{ marginBottom: 0 }}>
          This is a deterministic orientation move, not a separate
          existence theorem. It converts the internal maximum-degree
          information supplied by the Lovász partition into explicit
          total-outdegree ranges.
        </p>
      </section>
    </>
  )
}

function BalancedReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Lemma (Balanced orientation)</h3>
        <p>
          Every finite graph <Math>{'H'}</Math> has an orientation{' '}
          <Math>{'D'}</Math> such that, for every{' '}
          <Math>{'v\\in V(H)'}</Math>,
        </p>
        <Formula>
          {'d_D^+(v)\\in\\left\\{\\left\\lfloor\\frac{d_H(v)}2\\right\\rfloor,\\left\\lceil\\frac{d_H(v)}2\\right\\rceil\\right\\}.'}
        </Formula>
      </section>
      <section>
        <h3>Proof</h3>
        <p>
          Add one new vertex adjacent to every odd-degree vertex of{' '}
          <Math>{'H'}</Math>. The augmented graph is Eulerian. Orient an
          Euler tour in each component and delete the added edges. Each
          original vertex is left with one of the two integers nearest
          half its degree as its outdegree.
        </p>
      </section>
    </>
  )
}

function AvoidCReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>
          Theorem (<Math>{'c'}</Math>-avoiding)
        </h3>
        <p>
          Let <Math>{'H'}</Math> be a finite graph and let{' '}
          <Math>{'c>1'}</Math> be an integer. Then <Math>{'H'}</Math>{' '}
          has an orientation <Math>{'D'}</Math> such that
        </p>
        <Formula>{'d_D^+(v)\\neq c\\qquad\\text{for every }v\\in V(H).'}</Formula>
      </section>
      <section style={{ marginBottom: '32px' }}>
        <h3>Proof idea</h3>
        <p>
          In each nontrivial component choose a spanning tree rooted at a
          leaf. Orient the non-tree edges first, with every non-tree edge
          incident with the root pointing toward the root. Process the
          remaining vertices from the leaves toward the root. At each
          non-root vertex only its parent edge is still free, so its two
          possible final outdegrees are consecutive and at least one is
          different from <Math>{'c'}</Math>. The root finishes with
          outdegree <Math>{'0'}</Math> or <Math>{'1'}</Math>, hence also
          avoids <Math>{'c>1'}</Math>.
        </p>
      </section>
      <section>
        <h3>Reference</h3>
        <p>
          S. Akbari, M. Dalirrooyfard, K. Ehsani, K. Ozeki, and
          R. Sherkati, <em>Orientations of Graphs Avoiding Given Lists
          on Out-degrees</em>, Theorem 3 in the manuscript version.
        </p>
        <ReferenceLink href="https://tgt.ynu.ac.jp/ozeki/2016ADEOS.pdf">
          Manuscript PDF
        </ReferenceLink>
      </section>
    </>
  )
}

function MaLuReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Theorem (Ma–Lu)</h3>
        <p>
          Let <Math>{'H'}</Math> be a graph and let{' '}
          <Math>{'F_H:V(H)\\to2^{\\mathbb N}'}</Math> be a forbidden
          outdegree-list assignment. Suppose that, for every{' '}
          <Math>{'v\\in V(H)'}</Math>, the set <Math>{'F_H(v)'}</Math>{' '}
          contains no two consecutive integers and
        </p>
        <Formula>{'|F_H(v)|\\leq\\frac{d_H(v)-1}{2}.'}</Formula>
        <p>
          Then <Math>{'H'}</Math> has an <Math>{'F_H'}</Math>-avoiding
          orientation.
        </p>
      </section>
      <section>
        <h3>Reference</h3>
        <p>
          Xinxin Ma and Hongliang Lu, <em>A characterization on
          orientations of graphs avoiding given lists on out-degrees</em>,
          Corollary 3.1, arXiv:2310.15650v1 (2023).
        </p>
        <ReferenceLink href="https://arxiv.org/abs/2310.15650v1">
          arXiv paper
        </ReferenceLink>
      </section>
    </>
  )
}

function HasanvandReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Theorem (Hasanvand)</h3>
        <p>
          Let <Math>{'H'}</Math> be a simple graph and let{' '}
          <Math>{'p,q:V(H)\\to\\mathbb Z'}</Math> satisfy, for every
          vertex <Math>{'v'}</Math>,
        </p>
        <Formula>
          {'p(v)<q(v),\\qquad q(v)\\geq\\frac12d_H(v),\\qquad p(v)\\geq\\frac12q(v)-2.'}
        </Formula>
        <p>The following are equivalent:</p>
        <p>
          (1) <Math>{'H'}</Math> has an orientation with{' '}
          <Math>{'p(v)\\leq d_H^+(v)\\leq q(v)'}</Math> for every vertex.
        </p>
        <p>
          (2) <Math>{'H'}</Math> has an orientation with
        </p>
        <Formula>
          {'d_H^+(v)\\in\\{p(v),p(v)+1,q(v)-1,q(v)\\}\\qquad\\text{for every }v.'}
        </Formula>
        <p>
          Thus an interval of allowable outdegrees can be compressed to
          four endpoint values.
        </p>
      </section>
      <section>
        <h3>Reference</h3>
        <p>
          M. Hasanvand, <em>A necessary and sufficient condition for the
          existence of {'{'}p,p+1,q-1,q{'}'}-orientations in simple
          graphs</em>, arXiv:2205.10883 (2022).
        </p>
        <ReferenceLink href="https://arxiv.org/abs/2205.10883">
          arXiv paper
        </ReferenceLink>
      </section>
    </>
  )
}

function TwoFactorReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Lemma (Oriented 2-factor)</h3>
        <p>
          Let <Math>{'G'}</Math> be a finite <Math>{'2k'}</Math>-regular
          graph with <Math>{'k\\geq1'}</Math>. Then <Math>{'G'}</Math>{' '}
          contains a spanning 2-factor <Math>{'C'}</Math> whose cycles
          can be oriented so that
        </p>
        <Formula>{'d_C^+(v)=d_C^-(v)=1\\qquad\\text{for every }v\\in V(G).'}</Formula>
      </section>
      <section style={{ marginBottom: '32px' }}>
        <h3>Proof</h3>
        <p>
          Give each component an Eulerian orientation. Split every vertex
          into a left and right copy and replace each directed edge
          <Math>{'u\\to v'}</Math> by the bipartite edge{' '}
          <Math>{'u_Lv_R'}</Math>. The resulting bipartite graph is
          <Math>{'k'}</Math>-regular, hence has a perfect matching by
          Hall&apos;s theorem. The corresponding directed edges form the
          required spanning union of directed cycles.
        </p>
      </section>
      <section>
        <h3>Reduction rule</h3>
        <p>
          Removing <Math>{'C'}</Math> lowers every vertex degree by two,
          while the oriented factor contributes exactly one outgoing edge
          at every vertex. If the residual orientation has outdegree{' '}
          <Math>{'r'}</Math>, then the original outdegree is{' '}
          <Math>{'1+r'}</Math>.
        </p>
      </section>
    </>
  )
}

function StabilizeReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Lemma</h3>
        <p>
          Let <Math>{'D'}</Math> be an orientation, let{' '}
          <Math>{'X\\subseteq V(D)'}</Math>, and let <Math>{'Q'}</Math>{' '}
          be a nonempty set of outdegrees containing no two consecutive
          integers. Define
        </p>
        <Formula>{'P_Q=\\{v\\in X:d_D^+(v)\\in Q\\}.'}</Formula>
        <p>
          By repeatedly reversing arcs whose two endpoints currently lie
          in <Math>{'P_Q'}</Math>, one obtains an orientation in which{' '}
          <Math>{'P_Q'}</Math> is independent.
        </p>
      </section>
      <section>
        <h3>Why it works</h3>
        <p>
          Reversing an arc <Math>{'x\\to y'}</Math> changes the endpoint
          outdegrees by
        </p>
        <Formula>{'d_D^+(x)\\mapsto d_D^+(x)-1,\\qquad d_D^+(y)\\mapsto d_D^+(y)+1.'}</Formula>
        <p>
          Since <Math>{'Q'}</Math> contains no consecutive integers, both
          endpoints leave <Math>{'P_Q'}</Math>. Repetition terminates with
          no arc having both endpoints in <Math>{'P_Q'}</Math>.
        </p>
      </section>
    </>
  )
}

function DirectedMengerReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Capacitated directed Menger repair</h3>
        <p>
          Let <Math>{'D'}</Math> be a digraph and let{' '}
          <Math>{'B\\subseteq V(D)'}</Math> be the bad vertices. Give each
          <Math>{'b\\in B'}</Math> a positive demand <Math>{'r(b)'}</Math>{' '}
          and each <Math>{'v\\notin B'}</Math> a nonnegative capacity{' '}
          <Math>{'c(v)'}</Math>.
        </p>
        <p>
          To increase the bad outdegrees, seek pairwise arc-disjoint
          directed paths ending at each <Math>{'b'}</Math>, with exactly
          <Math>{'r(b)'}</Math> paths ending there and at most{' '}
          <Math>{'c(v)'}</Math> paths beginning at each nonbad vertex.
          Such a family exists if and only if, for every{' '}
          <Math>{'Y\\subseteq V(D)'}</Math>,
        </p>
        <Formula>
          {'\\sum_{b\\in B\\cap Y}r(b)\\leq e_D(V(D)\\setminus Y,Y)+\\sum_{v\\in Y\\setminus B}c(v).'}
        </Formula>
        <p>
          Reversing every path increases the outdegree of each bad endpoint
          by its demand while decreasing each starting vertex by the number
          of paths started there. The decrease version is the same theorem
          in the reversed digraph, with the cut direction reversed.
        </p>
      </section>
      <section>
        <h3>Flow interpretation</h3>
        <p>
          The statement is an integral max-flow/min-cut theorem: add a
          source with capacities <Math>{'c(v)'}</Math> to the available
          vertices and a sink receiving demand <Math>{'r(b)'}</Math> from
          the bad vertices. Integrality decomposes a maximum flow into the
          required directed paths.
        </p>
      </section>
    </>
  )
}

function toolTitle(activeTool: HomeToolId | null) {
  if (activeTool === null) return ''

  for (const group of toolGroups) {
    const tool = group.tools.find(
      (candidate) => candidate.id === activeTool,
    )

    if (tool !== undefined) return tool.name
  }

  return ''
}

function GeneralToolReference({
  activeTool,
}: {
  activeTool: HomeToolId
}) {
  switch (activeTool) {
    case 'lovasz':
      return <LovaszReference />
    case 'orient-across':
      return <OrientAcrossReference />
    case 'balanced':
      return <BalancedReference />
    case 'avoid-c':
      return <AvoidCReference />
    case 'ma-lu':
      return <MaLuReference />
    case 'hasanvand':
      return <HasanvandReference />
    case 'parity':
      return <ParityBoundsReference application={null} />
    case 'two-factor':
      return <TwoFactorReference />
    case 'stabilize':
      return <StabilizeReference />
    case 'menger-local':
      return <DirectedMengerReference />
    case 'menger-reservoir':
      return <DirectedMengerReservoirReference application={null} />
  }
}

export default function HomeToolkit() {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [activeTool, setActiveTool] =
    useState<HomeToolId | null>(null)

  return (
    <>
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto 34px',
        }}
      >
        <button
          type="button"
          onClick={() => setToolsOpen((current) => !current)}
          aria-expanded={toolsOpen}
          style={{
            font: 'inherit',
            fontSize: '18px',
            padding: '9px 18px',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            background: '#ffffff',
            color: '#475569',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
          }}
        >
          See the tools used {toolsOpen ? '▴' : '▾'}
        </button>

        {toolsOpen && (
          <div
            style={{
              marginTop: '14px',
              padding: '20px',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              background: '#f8fafc',
              boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '15px',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              The complete mathematical toolkit used by the playground.
              Select a tool to see its theorem, certificate, or reduction
              rule in general form.
            </div>

            {toolGroups.map((group, groupIndex) => (
              <section
                key={group.label}
                style={{
                  marginTop: groupIndex === 0 ? 0 : '24px',
                }}
              >
                <div
                  style={{
                    marginBottom: '9px',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.label}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {group.tools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActiveTool(tool.id)}
                      style={{
                        minHeight: '96px',
                        padding: '15px 16px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        background: '#ffffff',
                        color: '#334155',
                        cursor: 'pointer',
                        font: 'inherit',
                        textAlign: 'left',
                        boxShadow:
                          '0 3px 10px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '17px',
                          fontWeight: 650,
                          color: '#1e293b',
                        }}
                      >
                        {tool.name}
                      </div>
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '14px',
                          lineHeight: 1.4,
                          color: '#64748b',
                        }}
                      >
                        {tool.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <ToolReferencePanel
        open={activeTool !== null}
        title={toolTitle(activeTool)}
        onClose={() => setActiveTool(null)}
      >
        {activeTool !== null && (
          <GeneralToolReference activeTool={activeTool} />
        )}
      </ToolReferencePanel>
    </>
  )
}
