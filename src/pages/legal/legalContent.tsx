import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Les mentions entre crochets [À compléter : …] doivent être remplacées par les
// informations officielles de la société avant la mise en ligne.
const todo = (what: string) => <mark className="lg-todo">[À compléter : {what}]</mark>

export type LegalDoc = { slug: string; title: string; updated: string; intro: ReactNode; sections: { h: string; body: ReactNode }[] }

const UPDATED = '24 novembre 2026'

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: 'mentions-legales',
    title: 'Mentions légales',
    updated: UPDATED,
    intro: <>Informations relatives à l’éditeur du site Kmertude, conformément à la loi n° 2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun.</>,
    sections: [
      {
        h: 'Éditeur du site',
        body: (
          <ul>
            <li>Raison sociale : {todo('dénomination et forme juridique')}</li>
            <li>Siège social : {todo('adresse complète, ville')}</li>
            <li>RCCM : {todo('numéro du registre du commerce')}</li>
            <li>Numéro d’identifiant unique (NIU) : {todo('NIU')}</li>
            <li>Téléphone : +237 622 244 994</li>
            <li>Email : {todo('adresse de contact')}</li>
            <li>Directeur de la publication : {todo('nom et fonction')}</li>
          </ul>
        ),
      },
      {
        h: 'Hébergement',
        body: (
          <ul>
            <li>Site web : GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</li>
            <li>Plateforme et données : {todo('nom et adresse de l’hébergeur du serveur applicatif')}</li>
          </ul>
        ),
      },
      {
        h: 'Activité',
        body: (
          <p>
            Kmertude est une plateforme de soutien scolaire supervisé : elle met en relation des familles et des apprenants
            avec des enseignants dont le dossier a été vérifié, organise les cours, assure le suivi pédagogique et gère la
            facturation et la rémunération des enseignants.
          </p>
        ),
      },
      {
        h: 'Propriété intellectuelle',
        body: (
          <p>
            L’ensemble des contenus du site (textes, logos, visuels, mise en page) est la propriété de l’éditeur ou utilisé
            avec autorisation. Toute reproduction ou réutilisation sans accord écrit préalable est interdite.
          </p>
        ),
      },
      {
        h: 'Responsabilité',
        body: (
          <p>
            L’éditeur s’efforce de fournir des informations exactes et à jour, sans pouvoir garantir l’absence d’erreur.
            Les liens vers des sites tiers sont fournis à titre indicatif ; l’éditeur n’est pas responsable de leur contenu.
          </p>
        ),
      },
    ],
  },
  {
    slug: 'conditions-generales',
    title: 'Conditions générales de service',
    updated: UPDATED,
    intro: <>Les présentes conditions encadrent l’utilisation de la plateforme Kmertude par les familles, les apprenants adultes et les enseignants. La création d’un compte vaut acceptation.</>,
    sections: [
      {
        h: '1. Le service',
        body: (
          <p>
            Kmertude propose des cours particuliers à domicile, en ligne ou en petit groupe. La plateforme qualifie chaque
            demande, sélectionne un enseignant validé, assure le suivi des séances et gère la facturation. Les cours sont
            exclusivement organisés via la plateforme.
          </p>
        ),
      },
      {
        h: '2. Comptes',
        body: (
          <ul>
            <li>Chaque utilisateur est responsable de la confidentialité de ses identifiants.</li>
            <li>Les informations fournies (identité, téléphone, adresse) doivent être exactes et tenues à jour.</li>
            <li>Un enseignant ne peut recevoir de mission qu’après validation de son dossier (pièce d’identité, diplômes, coordonnées Mobile Money).</li>
          </ul>
        ),
      },
      {
        h: '3. Demandes et tarifs',
        body: (
          <p>
            La famille décrit son besoin ; un conseiller la rappelle pour le qualifier. Le tarif horaire est fixé par Kmertude
            et communiqué avant toute affectation. Les montants sont exprimés en francs CFA (FCFA), toutes taxes comprises.
          </p>
        ),
      },
      {
        h: '4. Séances et comptes rendus',
        body: (
          <ul>
            <li>Après chaque séance, l’enseignant déclare sa durée et rédige un compte rendu.</li>
            <li>La famille dispose de <b>72 heures</b> pour confirmer ou contester la séance, en indiquant un motif. Sans réponse dans ce délai, la séance est réputée confirmée.</li>
            <li>Une contestation est examinée par l’équipe Kmertude, qui peut ajuster ou annuler la séance concernée.</li>
          </ul>
        ),
      },
      {
        h: '5. Facturation et paiement',
        body: (
          <ul>
            <li>Les séances confirmées sont facturées chaque mois.</li>
            <li>Le paiement s’effectue par MTN Mobile Money ou Orange Money, depuis l’espace client ou auprès d’un conseiller.</li>
            <li>Une facture non réglée plus de <b>10 jours</b> après son échéance suspend la possibilité de créer de nouvelles demandes jusqu’à régularisation.</li>
          </ul>
        ),
      },
      {
        h: '6. Enseignants',
        body: (
          <ul>
            <li>Les propositions de mission sont anonymisées et valables 48 heures.</li>
            <li>La rémunération est versée sur le compte Mobile Money déclaré, selon un bordereau, après encaissement des séances correspondantes.</li>
            <li>L’enseignant s’engage à ne pas solliciter de paiement direct auprès des familles.</li>
          </ul>
        ),
      },
      {
        h: '7. Annulation et résiliation',
        body: (
          <p>
            Une demande peut être annulée tant qu’aucun enseignant n’a été affecté. L’utilisateur peut fermer son compte à
            tout moment, sous réserve du règlement des sommes dues. Kmertude peut suspendre un compte en cas de manquement
            aux présentes conditions.
          </p>
        ),
      },
      {
        h: '8. Litiges',
        body: (
          <p>
            Les présentes conditions sont soumises au droit camerounais. En cas de différend, les parties recherchent d’abord
            une solution amiable ; à défaut, les juridictions compétentes de {todo('ville du siège')} seront saisies.
          </p>
        ),
      },
    ],
  },
  {
    slug: 'donnees-personnelles',
    title: 'Données personnelles',
    updated: UPDATED,
    intro: <>Kmertude traite vos données dans le respect de la législation camerounaise relative à la protection des données à caractère personnel et à la cybersécurité (loi n° 2010/012 du 21 décembre 2010).</>,
    sections: [
      {
        h: 'Données collectées',
        body: (
          <ul>
            <li><b>Familles et apprenants</b> : nom, prénom, téléphone, email, adresse des cours, informations scolaires du bénéficiaire.</li>
            <li><b>Enseignants</b> : identité, diplômes et pièces justificatives, zones d’intervention, numéro Mobile Money.</li>
            <li><b>Suivi</b> : séances, comptes rendus, messages échangés sur la plateforme, factures et paiements.</li>
          </ul>
        ),
      },
      {
        h: 'Finalités',
        body: (
          <ul>
            <li>Vous rappeler et qualifier votre demande.</li>
            <li>Sélectionner un enseignant adapté et organiser les cours.</li>
            <li>Assurer le suivi pédagogique, la facturation et la rémunération.</li>
            <li>Respecter nos obligations légales et comptables.</li>
          </ul>
        ),
      },
      {
        h: 'Destinataires',
        body: (
          <p>
            Vos données sont accessibles à l’équipe Kmertude et, pour le strict nécessaire, à l’enseignant affecté
            (prénom de l’élève, niveau, quartier). Les propositions envoyées aux enseignants sont anonymisées.
            Les opérateurs de paiement reçoivent uniquement les informations nécessaires à la transaction.
            Vos données ne sont jamais vendues.
          </p>
        ),
      },
      {
        h: 'Durée de conservation',
        body: (
          <p>
            Les données de compte sont conservées tant que le compte est actif, puis archivées pendant la durée légale de
            conservation des pièces comptables. Les demandes de rappel non abouties sont supprimées au bout de 12 mois.
          </p>
        ),
      },
      {
        h: 'Vos droits',
        body: (
          <p>
            Vous pouvez accéder à vos données, les rectifier ou demander leur suppression, et vous opposer à leur traitement.
            Une grande partie de vos informations est modifiable depuis votre <Link to="/profil">profil</Link>. Pour toute
            autre demande, écrivez-nous à {todo('adresse email dédiée')} ou appelez le +237 622 244 994.
          </p>
        ),
      },
      {
        h: 'Sécurité',
        body: (
          <p>
            Les échanges avec la plateforme sont chiffrés (HTTPS). Les documents des enseignants ne sont consultables que par
            leur auteur et l’équipe de validation.
          </p>
        ),
      },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookies et stockage local',
    updated: UPDATED,
    intro: <>Kmertude n’utilise ni cookie publicitaire ni outil de suivi tiers.</>,
    sections: [
      {
        h: 'Ce que nous enregistrons sur votre appareil',
        body: (
          <>
            <p>Le site utilise uniquement le stockage local de votre navigateur, pour fonctionner :</p>
            <table className="lg-table">
              <thead><tr><th>Élément</th><th>Rôle</th><th>Durée</th></tr></thead>
              <tbody>
                <tr><td>Session</td><td>Vous garder connecté(e) à votre espace</td><td>Jusqu’à la déconnexion</td></tr>
                <tr><td>Recherches récentes</td><td>Pré-remplir vos prochaines demandes</td><td>Jusqu’à suppression</td></tr>
                <tr><td>Préférences newsletter</td><td>Mémoriser votre inscription</td><td>Jusqu’à suppression</td></tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        h: 'Comment les supprimer',
        body: (
          <p>
            La déconnexion efface votre session. Vous pouvez supprimer toutes ces données à tout moment depuis les réglages de
            votre navigateur (« Effacer les données de navigation »). Le site restera utilisable, mais vous devrez vous
            reconnecter.
          </p>
        ),
      },
    ],
  },
]
