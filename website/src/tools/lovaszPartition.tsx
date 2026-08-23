import Math from '../components/Math'

export type LovaszPair = {
  s: number
  t: number
}

/*
 * Every Lovasz partition used by the
 * playground is chosen by the stronger
 * extremal rule:
 *
 *   minimize
 *
 *     t e_H(L) + (s+1)e_H(R),
 *
 *   and, subject to this, maximize |R|.
 *
 * Thus the usual maximum-degree
 * partition comes with an additional
 * structural certificate for free.
 *
 * The certificate is asymmetric:
 *
 *   L = stable-set side,
 *   R = reservoir side.
 */
export type LovaszStructuralCertificate = {
  type:
    'extremal-lovasz-reservoir'

  degree: number

  s: number
  t: number

  stablePart: 'L'
  reservoirPart: 'R'
}

export type LovaszApplication = {
  pair: LovaszPair

  certificate:
    LovaszStructuralCertificate
}

export const lovaszPartitionTool = {
  id: 'lovasz-partition',
  name: 'Lovász Partition',
  menuLabel: 'Lovász partition',
} as const

export function getLovaszPairs(
  degree: number,
): LovaszPair[] {
  const pairs:
    LovaszPair[] = []

  /*
   * For a d-regular graph we use the
   * tight Lovasz condition
   *
   *   s+t=d-1,
   *
   * and list one representative from
   * each symmetric pair.
   *
   * We deliberately put the larger
   * bound on L and the smaller bound
   * on R. The strengthened extremal
   * certificate is then naturally
   * phrased with R as the reservoir.
   */
  for (
    let t = 0;

    t <=
      globalThis.Math.floor(
        (degree - 1) / 2,
      );

    t += 1
  ) {
    pairs.push({
      s:
        degree -
        1 -
        t,

      t,
    })
  }

  return pairs
}

/*
 * Kept for compatibility with older
 * code importing the original
 * 12-regular menu.
 */
export const lovaszPairs =
  getLovaszPairs(12)

/*
 * Turn a menu pair into the actual
 * extremal Lovasz application used by
 * the playground.
 *
 * At present the playground offers
 * only tight pairs on a regular graph.
 */
export function createLovaszApplication({
  degree,
  pair,
}: {
  degree: number
  pair: LovaszPair
}): LovaszApplication | null {
  if (
    !Number.isInteger(
      degree,
    ) ||
    degree < 0 ||
    !Number.isInteger(
      pair.s,
    ) ||
    !Number.isInteger(
      pair.t,
    ) ||
    pair.s < 0 ||
    pair.t < 0 ||
    pair.s +
      pair.t !==
      degree - 1
  ) {
    return null
  }

  return {
    pair: {
      s: pair.s,
      t: pair.t,
    },

    certificate: {
      type:
        'extremal-lovasz-reservoir',

      degree,

      s: pair.s,
      t: pair.t,

      stablePart: 'L',
      reservoirPart: 'R',
    },
  }
}

type LovaszPartitionReferenceProps = {
  /*
   * partition is retained temporarily
   * for compatibility with the existing
   * graph/reference plumbing.
   *
   * Once BlobLab is updated, the
   * application will be the preferred
   * source.
   */
  partition:
    LovaszPair | null

  application?:
    LovaszApplication | null
}

function PanelFormula({
  children,
}: {
  children: string
}) {
  return (
    <div
      style={{
        textAlign:
          'center',

        margin:
          '18px 0',

        padding:
          '10px 12px',

        border:
          '1px solid #e2e8f0',

        borderRadius:
          '8px',

        background:
          '#f8fafc',

        overflowX:
          'auto',
      }}
    >
      <Math display>
        {children}
      </Math>
    </div>
  )
}

export function LovaszPartitionReference({
  partition,
  application = null,
}: LovaszPartitionReferenceProps) {
  const activePair =
    application?.pair ??
    partition

  const degree =
    application
      ?.certificate
      .degree ??
    (
      activePair ===
      null
        ? null
        : activePair.s +
          activePair.t +
          1
    )

  return (
    <>
      {/* CLASSICAL THEOREM */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Theorem
          (Lovász)
        </h3>

        <p>
          Let{' '}
          <Math>{'H'}</Math>{' '}
          be a finite graph,
          and let{' '}
          <Math>{'s,t\\geq0'}</Math>{' '}
          be integers satisfying
        </p>

        <PanelFormula>
          {
            's+t'
            + '\\geq '
            + '\\Delta(H)-1.'
          }
        </PanelFormula>

        <p>
          Then{' '}
          <Math>{'V(H)'}</Math>{' '}
          can be partitioned
          into{' '}
          <Math>{'L\\cup R'}</Math>{' '}
          so that
        </p>

        <PanelFormula>
          {
            '\\Delta(H[L])'
            + '\\leq s,'
            + '\\qquad '
            + '\\Delta(H[R])'
            + '\\leq t.'
          }
        </PanelFormula>
      </section>

      {/* STRENGTHENED CHOICE */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Extremal choice used
          here
        </h3>

        <p>
          In the playground,
          the current graph{' '}
          <Math>{'H'}</Math>{' '}
          is regular. Suppose it
          is{' '}
          <Math>{'d'}</Math>
          -regular and we use a
          tight pair
        </p>

        <PanelFormula>
          {
            's+t=d-1.'
          }
        </PanelFormula>

        <p>
          We do not choose an
          arbitrary partition
          supplied by the
          Lovász theorem.
          Among all partitions{' '}
          <Math>{'V(H)=L\\cup R'}</Math>,
          choose one minimizing
        </p>

        <PanelFormula>
          {
            '\\Phi(L,R)'
            + '='
            + 't\\,e_H(L)'
            + '+'
            + '(s+1)e_H(R),'
          }
        </PanelFormula>

        <p>
          and, subject to
          minimizing{' '}
          <Math>{'\\Phi'}</Math>,
          maximize{' '}
          <Math>{'|R|'}</Math>.
          This extremal choice
          still gives the usual
          Lovász bounds, but it
          also gives a stronger
          structural property.
        </p>

        <PanelFormula>
          {
            '\\Delta(H[L])'
            + '\\leq s,'
            + '\\qquad '
            + '\\Delta(H[R])'
            + '\\leq t.'
          }
        </PanelFormula>
      </section>

      {/* STRUCTURAL CERTIFICATE */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Structural
          certificate
        </h3>

        <p>
          Let{' '}
          <Math>{'P\\subseteq L'}</Math>{' '}
          be any independent set and
          let{' '}
          <Math>{'S\\subseteq R'}</Math>.
          Define
        </p>

        <PanelFormula>
          {
            'Q_P(S)'
            + '='
            + '\\{'
            + 'p\\in P:'
            + 'N_H(p)\\cap R'
            + '\\subseteq S'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          Thus{' '}
          <Math>{'Q_P(S)'}</Math>{' '}
          consists of the
          vertices of{' '}
          <Math>{'P'}</Math>{' '}
          whose entire
          neighborhood on the
          reservoir side lies
          inside{' '}
          <Math>{'S'}</Math>.
        </p>

        <p>
          The extremal
          partition satisfies
          the stronger
          inequality
        </p>

        <PanelFormula>
          {
            'e_{H[R]}(S)'
            + '+'
            + 'e_H(S,R\\setminus S)'
            + '+'
            + 't|Q_P(S)|'
            + '\\leq '
            + 't|S|.'
          }
        </PanelFormula>

        {activePair !==
          null &&
        activePair.t >
          0 ? (
          <>
            <p>
              Since{' '}
              <Math>
                {
                  '\\Delta(H[R])\\leq t'
                }
              </Math>
              , we also have
            </p>

            <PanelFormula>
              {
                '2e_{H[R]}(S)'
                + '+'
                + 'e_H(S,R\\setminus S)'
                + '\\leq '
                + 't|S|.'
              }
            </PanelFormula>

            <p>
              Combining the two
              inequalities gives
              the convenient
              consequence
            </p>

            <PanelFormula>
              {
                'e_{H[R]}(S)'
                + '+'
                + '|Q_P(S)|'
                + '\\leq '
                + '\\frac{t+1}{2}|S|.'
              }
            </PanelFormula>
          </>
        ) : (
          <>
            <p>
              When{' '}
              <Math>{'t=0'}</Math>,
              the extremal choice
              makes{' '}
              <Math>{'R'}</Math>{' '}
              a maximum independent
              set. In this
              degenerate case
              the corresponding
              exchange property
              is
            </p>

            <PanelFormula>
              {
                '|Q_P(S)|'
                + '\\leq '
                + '|S|.'
              }
            </PanelFormula>
          </>
        )}

        <p>
          Most proofs need only
          the maximum-degree
          bounds. They may simply
          ignore this additional
          certificate. When a
          later repair needs it,
          however, the certificate
          is already available.
        </p>
      </section>

      {/* PROOF */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Proof of the
          strengthened choice
        </h3>

        <p>
          Assume{' '}
          <Math>{'H'}</Math>{' '}
          is{' '}
          <Math>{'d'}</Math>
          -regular and{' '}
          <Math>{'s+t=d-1'}</Math>.
          Choose{' '}
          <Math>{'(L,R)'}</Math>{' '}
          by the extremal rule
          above.
        </p>

        <p>
          First let{' '}
          <Math>{'v\\in R'}</Math>{' '}
          and put{' '}
          <Math>{'r=d_R(v)'}</Math>.
          Moving{' '}
          <Math>{'v'}</Math>{' '}
          from{' '}
          <Math>{'R'}</Math>{' '}
          to{' '}
          <Math>{'L'}</Math>{' '}
          changes the potential
          by
        </p>

        <PanelFormula>
          {
            't(d-r)'
            + '-'
            + '(s+1)r'
            + '='
            + 'd(t-r).'
          }
        </PanelFormula>

        <p>
          Minimality therefore
          gives{' '}
          <Math>{'r\\leq t'}</Math>.
          Hence
        </p>

        <PanelFormula>
          {
            '\\Delta(H[R])'
            + '\\leq t.'
          }
        </PanelFormula>

        <p>
          Similarly, if{' '}
          <Math>{'v\\in L'}</Math>{' '}
          and{' '}
          <Math>{'r=d_L(v)'}</Math>,
          moving{' '}
          <Math>{'v'}</Math>{' '}
          from{' '}
          <Math>{'L'}</Math>{' '}
          to{' '}
          <Math>{'R'}</Math>{' '}
          changes the potential
          by
        </p>

        <PanelFormula>
          {
            '(s+1)(d-r)'
            + '-'
            + 'tr'
            + '='
            + 'd(s+1-r).'
          }
        </PanelFormula>

        <p>
          Minimality gives{' '}
          <Math>{'r\\leq s+1'}</Math>.
          If{' '}
          <Math>{'r=s+1'}</Math>,
          the potential would
          remain unchanged while{' '}
          <Math>{'|R|'}</Math>{' '}
          increased, contradicting
          the tie-break. Thus
        </p>

        <PanelFormula>
          {
            '\\Delta(H[L])'
            + '\\leq s.'
          }
        </PanelFormula>

        <p>
          Now fix an independent set{' '}
          <Math>{'P\\subseteq L'}</Math>{' '}
          and{' '}
          <Math>{'S\\subseteq R'}</Math>,
          and write
        </p>

        <PanelFormula>
          {
            'Q=Q_P(S).'
          }
        </PanelFormula>

        <p>
          Swap{' '}
          <Math>{'Q'}</Math>{' '}
          and{' '}
          <Math>{'S'}</Math>:
        </p>

        <PanelFormula>
          {
            'L\''
            + '='
            + '(L\\setminus Q)'
            + '\\cup S,'
            + '\\qquad '
            + 'R\''
            + '='
            + '(R\\setminus S)'
            + '\\cup Q.'
          }
        </PanelFormula>

        <p>
          Because{' '}
          <Math>{'P'}</Math>{' '}
          is independent, so is{' '}
          <Math>{'Q'}</Math>.
          Moreover, by the
          definition of{' '}
          <Math>{'Q_P(S)'}</Math>,
          there are no edges
          from{' '}
          <Math>{'Q'}</Math>{' '}
          to{' '}
          <Math>{'R\\setminus S'}</Math>.
          A direct edge count
          gives
        </p>

        <PanelFormula>
          {
            '\\Phi(L\',R\')'
            + '-'
            + '\\Phi(L,R)'
            + '='
            + 'd\\left('
            + 't(|S|-|Q|)'
            + '-'
            + 'e_{H[R]}(S)'
            + '-'
            + 'e_H(S,R\\setminus S)'
            + '\\right).'
          }
        </PanelFormula>

        <p>
          Since the original
          partition minimizes{' '}
          <Math>{'\\Phi'}</Math>,
          this difference is
          nonnegative. Therefore
        </p>

        <PanelFormula>
          {
            'e_{H[R]}(S)'
            + '+'
            + 'e_H(S,R\\setminus S)'
            + '+'
            + 't|Q_P(S)|'
            + '\\leq '
            + 't|S|.'
          }
        </PanelFormula>

        <p>
          When{' '}
          <Math>{'t\\geq1'}</Math>,
          the degree bound on{' '}
          <Math>{'H[R]'}</Math>{' '}
          gives
        </p>

        <PanelFormula>
          {
            '2e_{H[R]}(S)'
            + '+'
            + 'e_H(S,R\\setminus S)'
            + '\\leq '
            + 't|S|.'
          }
        </PanelFormula>

        <p>
          Writing{' '}
          <Math>
            {
              'x=e_{H[R]}(S)'
            }
          </Math>
          , the first inequality
          gives
        </p>

        <PanelFormula>
          {
            '|Q_P(S)|'
            + '\\leq '
            + '|S|-\\frac{x}{t},'
          }
        </PanelFormula>

        <p>
          while the second gives{' '}
          <Math>
            {
              'x\\leq t|S|/2'
            }
          </Math>
          . Hence
        </p>

        <PanelFormula>
          {
            'e_{H[R]}(S)'
            + '+'
            + '|Q_P(S)|'
            + '\\leq '
            + '\\frac{t+1}{2}|S|.'
          }
        </PanelFormula>

        <p>
          Finally, if{' '}
          <Math>{'t=0'}</Math>,
          minimizing the
          potential forces{' '}
          <Math>{'R'}</Math>{' '}
          to be independent, and the
          tie-break makes it a
          maximum independent set.
          Since
        </p>

        <PanelFormula>
          {
            '(R\\setminus S)'
            + '\\cup Q_P(S)'
          }
        </PanelFormula>

        <p>
          is also independent,
          maximal cardinality
          gives{' '}
          <Math>
            {
              '|Q_P(S)|\\leq |S|'
            }
          </Math>
          .
        </p>
      </section>

      {/* APPLICATION */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Application here
        </h3>

        {activePair ===
        null ? (
          <p>
            Choose a tight
            Lovász pair{' '}
            <Math>{'(s,t)'}</Math>.
            The playground then
            chooses the extremal
            partition above, so
            the ordinary
            maximum-degree bounds
            and the structural
            certificate are both
            available.
          </p>
        ) : (
          <>
            <p>
              Here we use
            </p>

            <PanelFormula>
              {
                `(s,t)=(${activePair.s},${activePair.t}).`
              }
            </PanelFormula>

            {degree !==
              null && (
              <p>
                The current
                regular graph has
                degree{' '}

                <Math>
                  {`${degree}`}
                </Math>
                , so indeed{' '}

                <Math>
                  {
                    `${activePair.s}+${activePair.t}=${degree}-1`
                  }
                </Math>
                .
              </p>
            )}

            <p>
              The chosen
              partition satisfies
            </p>

            <PanelFormula>
              {
                `\\Delta(H[L])\\leq ${activePair.s},`
                + '\\qquad '
                + `\\Delta(H[R])\\leq ${activePair.t}.`
              }
            </PanelFormula>

            <p>
              In addition, every
              independent{' '}
              <Math>{'P\\subseteq L'}</Math>{' '}
              and every{' '}
              <Math>{'S\\subseteq R'}</Math>{' '}
              satisfy
            </p>

            <PanelFormula>
              {
                'e_{H[R]}(S)'
                + '+'
                + 'e_H(S,R\\setminus S)'
                + '+'
                + `${activePair.t}|Q_P(S)|`
                + '\\leq '
                + `${activePair.t}|S|.`
              }
            </PanelFormula>

            {activePair.t >
            0 ? (
              <>
                <p>
                  In particular,
                </p>

                <PanelFormula>
                  {
                    'e_{H[R]}(S)'
                    + '+'
                    + '|Q_P(S)|'
                    + '\\leq '
                    + `\\frac{${activePair.t + 1}}{2}|S|.`
                  }
                </PanelFormula>

                {activePair.t ===
                  3 && (
                  <p>
                    For{' '}
                    <Math>
                      {
                        `t=${activePair.t}`
                      }
                    </Math>
                    , this is the
                    especially useful
                    reservoir inequality
                  </p>
                )}

                {activePair.t ===
                  3 && (
                  <PanelFormula>
                    {
                      'e_{H[R]}(S)'
                      + '+'
                      + '|Q_P(S)|'
                      + '\\leq 2|S|.'
                    }
                  </PanelFormula>
                )}
              </>
            ) : (
              <>
                <p>
                  Since{' '}
                  <Math>{'t=0'}</Math>,
                  the reservoir side is
                  a maximum independent set,
                  and
                </p>

                <PanelFormula>
                  {
                    '|Q_P(S)|'
                    + '\\leq '
                    + '|S|.'
                  }
                </PanelFormula>
              </>
            )}
          </>
        )}
      </section>

      {/* REFERENCE */}

      <section>
        <h3>
          Reference
        </h3>

        <p>
          L. Lovász,{' '}
          <em>
            On decomposition of
            graphs
          </em>
          , Studia Scientiarum
          Mathematicarum
          Hungarica{' '}
          <strong>1</strong>{' '}
          (1966), 237–238.
        </p>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          The additional
          extremal certificate
          used by the playground
          is the elementary
          refinement proved
          above; it is stronger
          than the maximum-degree
          conclusion needed for
          the classical Lovász
          partition theorem.
        </p>
      </section>
    </>
  )
}